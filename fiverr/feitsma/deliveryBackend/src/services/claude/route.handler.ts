import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

// Adjust these two imports to match where your Shipment and Route models
// actually live in the project.
import Shipment from "../../models/Shipment.js";
import Route from "../../models/Route.js";

import {
  buildWarehouseTemplate,
  createWarehouseVisitShipments,
  generateRouteNumber,
} from "./warehouse.service.js";
import { validateRequestBody, validateShipment } from "./validation.service.js";
import { optimizeRoute } from "./routeOptimizer.service.js";
import {
  GeneratedRouteStop,
  RouteRequestBody,
  ShipmentDocument,
} from "./types.js";

export type RequestWithRouteOptions = Request & {
  userId?: string;
  /** Set this to true (before calling createOptimizedRoute, or in an
   * earlier middleware) to build and save the route without sending an
   * HTTP response. The handler still validates, builds, and persists the
   * route exactly as normal — it just hands the result to `next()` on
   * `req.routeCreationResult` instead of writing to `res`, so a
   * downstream handler in the same middleware chain can pick up from
   * there and send its own response once it's done its own work. */
  doNotReturn?: boolean;
  routeCreationResult?: RouteCreationResult;
};

export interface RouteCreationResult {
  success: boolean;
  status: number;
  message: string;
  route?: unknown; // the created Mongoose Route document — only present when success is true
}

const NUMBERED_ROUTE_STATUS = "scheduled";
const MIXED_ROUTE_STATUS = "scheduled"; // single-pass mixed routes are complete as soon as they're built — adjust to match your actual status enum
const SHIPMENT_STATUS = "pending";

const fail = (status: number, message: string): RouteCreationResult => ({
  success: false,
  status,
  message,
});

/**
 * All the actual route-building work, decoupled from Express's res: every
 * exit path returns a RouteCreationResult instead of writing to a
 * response. createOptimizedRoute below is the only place that decides
 * whether that result becomes an HTTP response or a handoff to next().
 *
 * Pipeline:
 *   validate request
 *   → determine/generate route number
 *   → load candidate shipments
 *   → select optimizer
 *   → receive optimized route
 *   → materialize a real Shipment for each mid-route depot visit (initial
 *     load excluded — that's plain Route metadata, not a stop)
 *   → save Route with the exact ordered shipment documents
 */
const buildRoute = async (
  req: RequestWithRouteOptions,
): Promise<RouteCreationResult> => {
  if (!req.userId) {
    return fail(401, "Not authenticated");
  }

  const body = req.body as Partial<RouteRequestBody>;
  body.userId = req.userId;

  // 1. validate request --------------------------------------------------
  const requestValidation = validateRequestBody(body);
  if (!requestValidation.valid) {
    return fail(400, requestValidation.errors[0] ?? "Invalid request");
  }

  const { vehicleCapacity, deliveryShift, routeType, userId } =
    body as RouteRequestBody;
  const ownerId = new mongoose.Types.ObjectId(userId);

  try {
    // 2. determine/generate the route number -----------------------------
    const routeNumber =
      routeType === "number"
        ? (body.routeNumber as string)
        : generateRouteNumber(ownerId);

    // 3. load candidate customer shipments --------------------------------
    // No DB round trip for the warehouse here — there's no longer a single
    // reused record to ensure. The optimizer gets an in-memory template
    // instead (step 4).
    const query =
      routeType === "mixed"
        ? {
            OwnerRef: ownerId,
            deliveryShift,
            routeNumber: { $exists: false },
            isWarehouse: { $ne: true },
            status: "pending",
          }
        : {
            OwnerRef: ownerId,
            status: "pending",
            routeNumber,
            isWarehouse: { $ne: true },
          };

    const candidateShipments = (await Shipment.find(
      query,
    ).lean()) as unknown as ShipmentDocument[];

    if (candidateShipments.length === 0) {
      return fail(422, "No eligible shipments were found for this request");
    }

    const shipmentErrors = candidateShipments.flatMap(
      (s) => validateShipment(s).errors,
    );
    if (shipmentErrors.length > 0) {
      console.error(
        "Route generation: invalid candidate shipments",
        shipmentErrors,
      );
      return fail(422, "Unable to create a feasible route");
    }

    // 4. select optimizer + 5. receive optimized route ---------------------
    const warehouseTemplate = buildWarehouseTemplate({
      ownerId,
      routeNumber,
      deliveryShift,
      status: SHIPMENT_STATUS,
    });

    const result = optimizeRoute({
      routeType,
      shipments: candidateShipments,
      warehouseShipment: warehouseTemplate,
      vehicleCapacity,
    });

    if (!result.feasible) {
      console.error("Route generation infeasible", {
        userId,
        routeType,
        routeNumber,
        unassignedShipmentIds: result.unassignedShipmentIds,
      });
      return fail(422, "Unable to create a feasible route");
    }

    const routeStatus =
      routeType === "mixed" ? MIXED_ROUTE_STATUS : NUMBERED_ROUTE_STATUS;

    // 6. materialize a real Shipment for every depot visit — except the
    // initial load, which isn't a "stop" the driver visits, just how the
    // route starts. That's already captured as a plain number on the
    // Route (result.initialLoad below), so it doesn't need a redundant
    // shipment of its own. The persisted route starts directly with the
    // first real shipment; only mid-route refill/unload visits still get
    // materialized, with shipmentType "collection" for a load and
    // "delivery" for an unload, and boxQuantity set to the exact amount
    // moved at that stop — dynamic, never a hardcoded type or a
    // placeholder quantity.
    const routeStops = result.stops.filter(
      (stop) => !(stop.type === "depot" && stop.reason === "initial-load"),
    );
    const depotStops = routeStops.filter((stop) => stop.type === "depot");

    let warehouseVisitShipments: ShipmentDocument[] = [];
    try {
      warehouseVisitShipments = await createWarehouseVisitShipments(
        Shipment,
        depotStops,
        {
          ownerId,
          routeNumber,
          deliveryShift,
          status: SHIPMENT_STATUS,
        },
      );
    } catch (warehouseError) {
      console.error(
        "Route generation: failed to create warehouse visit shipments",
        warehouseError,
      );
      return fail(500, "Unable to create a feasible route");
    }

    // 7. assemble the exact, ordered shipment documents for the Route -------
    const customerShipmentById = new Map(
      candidateShipments.map((s) => [s._id.toString(), s]),
    );
    let warehouseVisitIndex = 0;

    const orderedShipments: ShipmentDocument[] = routeStops.map(
      (stop: GeneratedRouteStop) => {
        if (stop.type === "depot") {
          const doc = warehouseVisitShipments[warehouseVisitIndex];
          warehouseVisitIndex += 1;
          return doc;
        }

        const doc = customerShipmentById.get(stop.shipmentId as string);
        if (!doc) {
          throw new Error(
            `Missing shipment document for stop ${stop.shipmentId}`,
          );
        }
        return doc;
      },
    );

    const assignedCustomerShipmentIds = candidateShipments
      .map((s) => s._id.toString())
      .filter((id) => !result.unassignedShipmentIds.includes(id));

    const totalBoxes = candidateShipments
      .filter((s) => assignedCustomerShipmentIds.includes(s._id.toString()))
      .reduce((sum, s) => sum + s.boxQuantity, 0);

    // 8. save Route -----------------------------------------------------------
    let route;
    try {
      route = await Route.create({
        OwnerRef: ownerId,
        vehicleCapacity,
        deliveryShift,
        routeNumber,
        status: routeStatus,
        totalBoxes,
        shipments: orderedShipments,
        initialLoad: result.initialLoad,
        maxVehicleLoad: result.maxVehicleLoad,
        totalDistance: result.totalDistance,
        depotVisitCount: result.depotVisitCount,
        feasible: result.feasible,
      });
    } catch (routeError) {
      // The route failed to save after the warehouse visit shipments were
      // already persisted — clean them up rather than leaving orphaned
      // records with a routeNumber that no Route actually references. A
      // Mongo session/transaction would be the more robust fix if you're
      // running a replica set; this is a compensating delete for a
      // standalone setup.
      const orphanedIds = warehouseVisitShipments.map((s) => s._id);
      if (orphanedIds.length > 0) {
        await Shipment.deleteMany({ _id: { $in: orphanedIds } }).catch(
          (cleanupError: unknown) =>
            console.error(
              "Route generation: failed to clean up orphaned warehouse shipments",
              cleanupError,
            ),
        );
      }
      throw routeError;
    }
    await Shipment.updateMany(
      { _id: { $in: assignedCustomerShipmentIds.map((s) => s) } },
      { $set: { status: "transit" } },
    );
    // Keep customer shipment assignments consistent with the route number
    // (section 34) — mixed routes pull from the unassigned pool, so tag
    // whichever ones were actually used.
    if (routeType === "mixed" && assignedCustomerShipmentIds.length > 0) {
      await Shipment.updateMany(
        {
          _id: {
            $in: assignedCustomerShipmentIds.map(
              (id) => new mongoose.Types.ObjectId(id),
            ),
          },
        },
        { $set: { routeNumber } },
      );
    }

    // 9. return the result --------------------------------------------------
    return {
      success: true,
      status: 201,
      message: "Route created successfully",
      route,
    };
  } catch (error) {
    console.error("Route generation failed", error);
    return fail(500, "Unable to create a feasible route");
  }
};

/**
 * Thin Express handler. Runs buildRoute above, then either:
 *   - sends the normal HTTP response (the default — nothing changes for
 *     any existing caller), or
 *   - if req.doNotReturn is true, skips res entirely: stashes the result
 *     on req.routeCreationResult and calls next(), so this can sit in the
 *     middle of a middleware chain and let a later handler take it from
 *     there and send its own response once it's finished its own work.
 */
export const createOptimizedRoute = async (
  req: RequestWithRouteOptions,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const result = await buildRoute(req);

  if (req.doNotReturn) {
    req.routeCreationResult = result;
    return next();
  }

  return result.success
    ? res
        .status(result.status)
        .json({ success: true, message: result.message, route: result.route })
    : res
        .status(result.status)
        .json({ success: false, message: result.message });
};
