import mongoose from "mongoose";
import { DEPOT } from "./depot.service.js";
import {
  GeneratedRouteStop,
  RouteRequestBody,
  ShipmentDocument,
} from "./types.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const isValidLat = (lat: number): boolean =>
  Number.isFinite(lat) && lat >= -90 && lat <= 90;
const isValidLng = (lng: number): boolean =>
  Number.isFinite(lng) && lng >= -180 && lng <= 180;

// ---------------------------------------------------------------------------
// Shipment / warehouse / request validation (section 36)
// ---------------------------------------------------------------------------

export const validateShipment = (
  shipment: ShipmentDocument,
): ValidationResult => {
  const errors: string[] = [];
  const id = shipment._id?.toString() ?? "(unknown id)";

  if (!shipment.boxQuantity || shipment.boxQuantity <= 0) {
    errors.push(`Shipment ${id} has invalid boxQuantity`);
  }

  if (
    shipment.shipmentType !== "delivery" &&
    shipment.shipmentType !== "collection"
  ) {
    errors.push(`Shipment ${id} has invalid shipmentType`);
  }

  const location = shipment.deliverySelected;
  if (!location || !isValidLat(location.lat) || !isValidLng(location.lng)) {
    errors.push(`Shipment ${id} has invalid coordinates`);
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Validates one materialized warehouse-visit shipment (section 36). Unlike
 * the old single reused warehouse record, shipmentType here is legitimately
 * either "collection" (a load — initial load or refill, increasing vehicle
 * load) or "delivery" (an unload, decreasing it) depending on the visit, so
 * both are accepted. boxQuantity may legitimately be 0 for a depot arrival
 * that neither loads nor unloads anything.
 */
export const validateWarehouseVisitShipment = (
  shipment: ShipmentDocument | null,
): ValidationResult => {
  const errors: string[] = [];

  if (!shipment) {
    errors.push("Warehouse visit shipment is missing");
    return { valid: false, errors };
  }

  if (shipment.isWarehouse !== true)
    errors.push("Warehouse visit shipment is missing isWarehouse: true");

  if (
    shipment.shipmentType !== "collection" &&
    shipment.shipmentType !== "delivery"
  ) {
    errors.push(
      "Warehouse visit shipment must have shipmentType 'collection' or 'delivery'",
    );
  }

  if (
    shipment.boxQuantity === undefined ||
    shipment.boxQuantity === null ||
    shipment.boxQuantity < 0
  ) {
    errors.push("Warehouse visit shipment has an invalid boxQuantity");
  }

  if (!isValidLat(DEPOT.lat) || !isValidLng(DEPOT.lng)) {
    errors.push("DEPOT coordinates are invalid — check DEPOT_LAT / DEPOT_LNG");
  }

  const loc = shipment.deliverySelected;
  if (!loc || loc.lat !== DEPOT.lat || loc.lng !== DEPOT.lng) {
    errors.push(
      "Warehouse visit shipment deliverySelected does not match DEPOT",
    );
  }

  return { valid: errors.length === 0, errors };
};

export const validateRequestBody = (
  body: Partial<RouteRequestBody>,
): ValidationResult => {
  const errors: string[] = [];

  if (!body.vehicleCapacity || body.vehicleCapacity <= 0)
    errors.push("vehicleCapacity must be a positive number");
  if (!body.deliveryShift) errors.push("deliveryShift is required");
  if (!body.userId || !mongoose.isValidObjectId(body.userId))
    errors.push("userId must be a valid id");
  if (body.routeType !== "mixed" && body.routeType !== "number")
    errors.push("routeType must be 'mixed' or 'number'");
  if (body.routeType === "number" && !body.routeNumber)
    errors.push("routeNumber is required when routeType is 'number'");

  return { valid: errors.length === 0, errors };
};

// ---------------------------------------------------------------------------
// Final, whole-route validation (section 43) — re-derives vehicle load from
// scratch and checks every invariant in section 37. Nothing is saved unless
// this passes.
// ---------------------------------------------------------------------------

export const validateGeneratedRoute = (
  stops: GeneratedRouteStop[],
  vehicleCapacity: number,
  requiredShipmentIds: string[] | null,
): ValidationResult => {
  const errors: string[] = [];

  if (stops.length === 0) {
    return { valid: false, errors: ["Route has no stops"] };
  }

  if (stops[0].type !== "depot") {
    errors.push("Route must start at the depot");
  }

  const seenShipmentIds = new Set<string>();
  let runningLoad = stops[0].vehicleLoadBefore;

  for (const [index, stop] of stops.entries()) {
    if (stop.vehicleLoadBefore !== runningLoad) {
      errors.push(
        `Stop ${index}: vehicleLoadBefore (${stop.vehicleLoadBefore}) doesn't match running load (${runningLoad})`,
      );
    }

    if (stop.vehicleLoadAfter < 0)
      errors.push(`Stop ${index}: load went negative`);
    if (stop.vehicleLoadAfter > vehicleCapacity)
      errors.push(`Stop ${index}: load exceeded vehicle capacity`);

    if (stop.vehicleLoadAfter - stop.vehicleLoadBefore !== stop.boxesChanged) {
      errors.push(`Stop ${index}: boxesChanged doesn't match the load delta`);
    }

    if (stop.type === "depot" && !stop.reason) {
      errors.push(`Stop ${index}: depot stop is missing a reason`);
    }

    if (stop.type === "shipment") {
      const id = stop.shipmentId;
      if (!id) {
        errors.push(`Stop ${index}: shipment stop is missing a shipmentId`);
      } else if (seenShipmentIds.has(id)) {
        errors.push(`Stop ${index}: shipment ${id} appears more than once`);
      } else {
        seenShipmentIds.add(id);
      }

      if (
        !stop.location ||
        !isValidLat(stop.location.lat) ||
        !isValidLng(stop.location.lng)
      ) {
        errors.push(`Stop ${index}: invalid location`);
      }
    }

    runningLoad = stop.vehicleLoadAfter;
  }

  if (requiredShipmentIds) {
    const missing = requiredShipmentIds.filter(
      (id) => !seenShipmentIds.has(id),
    );
    if (missing.length > 0) {
      errors.push(
        `Numbered route is missing required shipments: ${missing.join(", ")}`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
};
