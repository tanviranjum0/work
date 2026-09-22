import mongoose from "mongoose";
import { DEPOT } from "./depot.service.js";
import {
  GeneratedRouteStop,
  RouteConstructionError,
  ShipmentDocument,
  ShipmentType,
} from "./types.js";
import { validateWarehouseVisitShipment } from "./validation.service.js";

const WAREHOUSE_LOAD_CLIENT_NAME = "Warehouse — Load";
const WAREHOUSE_UNLOAD_CLIENT_NAME = "Warehouse — Unload";
const WAREHOUSE_PHONE = 11111111;
const WAREHOUSE_ADDRESS = "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands";

export interface WarehouseVisitContext {
  ownerId: mongoose.Types.ObjectId;
  routeNumber: string;
  deliveryShift: string;
  status: string;
}

/**
 * Generates a route number for mixed routes, which don't arrive with one.
 * Must be called before route construction begins (section 34) — its
 * result is carried through the warehouse visit shipments, the Route
 * document, and the assigned customer shipments.
 */
export const generateRouteNumber = (
  ownerId: mongoose.Types.ObjectId | string,
): string => {
  const ownerSuffix = ownerId.toString().slice(-6);
  const timestampPart = Date.now().toString(36).toUpperCase();
  return `MX-${ownerSuffix}-${timestampPart}`;
};

/**
 * A throwaway, never-persisted stand-in for "the warehouse", used only
 * while the optimizer is constructing the route (scoring, distance calc,
 * candidate identification). It carries a fresh ObjectId that never
 * touches the database — the *real* Shipment record for each depot visit
 * is created afterward, once the route is finalized, by
 * createWarehouseVisitShipments below. There's no longer a single shared
 * "physical warehouse" document to upsert and reuse.
 */
export const buildWarehouseTemplate = (
  context: WarehouseVisitContext,
): ShipmentDocument => ({
  _id: new mongoose.Types.ObjectId(),
  OwnerRef: context.ownerId,
  createdAt: new Date(),
  updatedAt: new Date(),

  clientName: "Warehouse",
  clientPhoneNumber: WAREHOUSE_PHONE,

  pickupAddress: WAREHOUSE_ADDRESS,
  deliveryAddress: WAREHOUSE_ADDRESS,

  isUrgent: false,
  deliverySelected: DEPOT,

  routeNumber: context.routeNumber,
  boxQuantity: 0,

  driverAllocated: false,
  deliveryShift: context.deliveryShift,

  shipmentType: "collection",
  status: "transit",

  note: "In-memory template used only during route construction — never persisted.",
  isWarehouse: true,
});

/**
 * Builds the creation payload for one real, persisted warehouse-visit
 * shipment from a depot GeneratedRouteStop. shipmentType is derived
 * dynamically from the direction of the load change — loading boxes onto
 * the vehicle (the initial load, or a refill) is a "collection" in the
 * same sense a customer collection is, since it increases vehicle load;
 * unloading boxes back at the warehouse is a "delivery", since it
 * decreases it. Never hardcoded, and boxQuantity is always the exact
 * amount moved at that specific stop.
 */
const buildWarehouseVisitPayload = (
  stop: GeneratedRouteStop,
  context: WarehouseVisitContext,
) => {
  const quantity = Math.abs(stop.boxesChanged);
  const isLoad = stop.boxesChanged >= 0;
  const shipmentType: ShipmentType = isLoad ? "collection" : "delivery";

  return {
    OwnerRef: context.ownerId,
    routeNumber: context.routeNumber,
    deliveryShift: context.deliveryShift,
    isWarehouse: true,

    clientName: isLoad
      ? WAREHOUSE_LOAD_CLIENT_NAME
      : WAREHOUSE_UNLOAD_CLIENT_NAME,
    clientPhoneNumber: WAREHOUSE_PHONE,

    pickupAddress: WAREHOUSE_ADDRESS,
    deliveryAddress: WAREHOUSE_ADDRESS,

    deliverySelected: DEPOT,

    shipmentType,
    boxQuantity: quantity,

    driverAllocated: false,
    isUrgent: false,

    status: "transit",
    note: `System-generated warehouse stop (${stop.reason ?? (isLoad ? "load" : "unload")}).`,
  };
};

/**
 * Persists one real Shipment document per depot visit in the finished
 * route — in the same order the route visits them — with the correct
 * dynamic shipmentType and the exact quantity moved at that stop. A
 * single insertMany keeps this to one round trip no matter how many times
 * the route returns to the depot (section 33).
 */
export const createWarehouseVisitShipments = async (
  ShipmentModel: mongoose.Model<any>,
  depotStops: GeneratedRouteStop[],
  context: WarehouseVisitContext,
): Promise<ShipmentDocument[]> => {
  if (depotStops.length === 0) return [];

  const payloads = depotStops.map((stop) =>
    buildWarehouseVisitPayload(stop, context),
  );

  for (const payload of payloads) {
    const validation = validateWarehouseVisitShipment(
      payload as unknown as ShipmentDocument,
    );
    if (!validation.valid) {
      throw new RouteConstructionError(
        `Warehouse visit shipment failed validation: ${validation.errors.join(", ")}`,
      );
    }
  }

  const inserted = await ShipmentModel.insertMany(payloads, { ordered: true });
  return inserted.map((doc: any) => doc.toObject() as ShipmentDocument);
};
