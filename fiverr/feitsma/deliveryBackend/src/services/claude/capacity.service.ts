import {
  calculateDistance,
  DistanceCalculator,
  KeyedPosition,
} from "./distance.service.js";
import {
  GeneratedRouteStop,
  Position,
  RouteConstructionError,
  ShipmentDocument,
  VehicleState,
  WarehouseOperationReason,
} from "./types.js";

// ---------------------------------------------------------------------------
// Feasibility checks (sections 13 / 14 / 37)
// ---------------------------------------------------------------------------

export const canDeliver = (currentLoad: number, boxQuantity: number): boolean =>
  boxQuantity > 0 && currentLoad >= boxQuantity;

export const canCollect = (
  currentLoad: number,
  boxQuantity: number,
  vehicleCapacity: number,
): boolean => boxQuantity > 0 && currentLoad + boxQuantity <= vehicleCapacity;

export const canRefill = (
  currentLoad: number,
  quantity: number,
  vehicleCapacity: number,
): boolean => quantity >= 0 && currentLoad + quantity <= vehicleCapacity;

export const canUnload = (currentLoad: number, quantity: number): boolean =>
  quantity >= 0 && currentLoad - quantity >= 0;

// ---------------------------------------------------------------------------
// Vehicle state transitions (section 30)
// ---------------------------------------------------------------------------

export const updateVehicleState = (
  state: VehicleState,
  loadDelta: number,
  newLocation: KeyedPosition,
  distance: number,
): VehicleState => {
  const nextLoad = state.currentLoad + loadDelta;

  return {
    ...state,
    currentLocation: { lat: newLocation.lat, lng: newLocation.lng },
    currentLocationKey: newLocation.key,
    currentLoad: nextLoad,
    maxLoad: Math.max(state.maxLoad, nextLoad),
    totalDistance: state.totalDistance + distance,
  };
};

// ---------------------------------------------------------------------------
// Shipment operations (sections 13 / 14 / 30)
// ---------------------------------------------------------------------------

export const performDelivery = (
  state: VehicleState,
  shipment: ShipmentDocument,
  distanceCalc: DistanceCalculator,
): { state: VehicleState; stop: GeneratedRouteStop } => {
  if (!canDeliver(state.currentLoad, shipment.boxQuantity)) {
    throw new RouteConstructionError(
      `Cannot deliver shipment ${shipment._id.toString()}: insufficient load`,
    );
  }

  const destination: KeyedPosition = {
    ...shipment.deliverySelected,
    key: shipment._id.toString(),
  };
  const distance = distanceCalc(
    { ...state.currentLocation, key: state.currentLocationKey },
    destination,
  );

  const vehicleLoadBefore = state.currentLoad;
  const nextState = updateVehicleState(
    state,
    -shipment.boxQuantity,
    destination,
    distance,
  );
  nextState.completedShipmentIds.add(shipment._id.toString());

  return {
    state: nextState,
    stop: {
      type: "shipment",
      shipmentId: shipment._id.toString(),
      shipment,
      location: shipment.deliverySelected,
      vehicleLoadBefore,
      vehicleLoadAfter: nextState.currentLoad,
      boxesChanged: -shipment.boxQuantity,
    },
  };
};

export const performCollection = (
  state: VehicleState,
  shipment: ShipmentDocument,
  vehicleCapacity: number,
  distanceCalc: DistanceCalculator,
): { state: VehicleState; stop: GeneratedRouteStop } => {
  if (!canCollect(state.currentLoad, shipment.boxQuantity, vehicleCapacity)) {
    throw new RouteConstructionError(
      `Cannot collect shipment ${shipment._id.toString()}: would exceed capacity`,
    );
  }

  const destination: KeyedPosition = {
    ...shipment.deliverySelected,
    key: shipment._id.toString(),
  };
  const distance = distanceCalc(
    { ...state.currentLocation, key: state.currentLocationKey },
    destination,
  );

  const vehicleLoadBefore = state.currentLoad;
  const nextState = updateVehicleState(
    state,
    shipment.boxQuantity,
    destination,
    distance,
  );
  nextState.completedShipmentIds.add(shipment._id.toString());

  return {
    state: nextState,
    stop: {
      type: "shipment",
      shipmentId: shipment._id.toString(),
      shipment,
      location: shipment.deliverySelected,
      vehicleLoadBefore,
      vehicleLoadAfter: nextState.currentLoad,
      boxesChanged: shipment.boxQuantity,
    },
  };
};

// ---------------------------------------------------------------------------
// Warehouse operations (sections 20–22, 30)
//
// depotLocation is passed in by the caller (core.optimizer.ts, which owns
// the DEPOT import from depot.service.ts) rather than imported here, so
// this module has no dependency on depot.service.ts — depot.service.ts is
// the one that depends on this module (for canDeliver/canCollect), and
// keeping the dependency one-directional avoids a circular import.
// ---------------------------------------------------------------------------

const performWarehouseOperation = (
  state: VehicleState,
  warehouseShipment: ShipmentDocument,
  loadDelta: number,
  reason: WarehouseOperationReason,
  depotLocation: Position,
  distanceCalc: DistanceCalculator,
): { state: VehicleState; stop: GeneratedRouteStop } => {
  const destination: KeyedPosition = { ...depotLocation, key: "DEPOT" };
  const distance = distanceCalc(
    { ...state.currentLocation, key: state.currentLocationKey },
    destination,
  );

  const vehicleLoadBefore = state.currentLoad;
  const nextState = updateVehicleState(state, loadDelta, destination, distance);
  nextState.depotVisits += 1;

  return {
    state: nextState,
    stop: {
      type: "depot",
      shipmentId: warehouseShipment._id.toString(),
      shipment: warehouseShipment,
      location: depotLocation,
      vehicleLoadBefore,
      vehicleLoadAfter: nextState.currentLoad,
      boxesChanged: loadDelta,
      reason,
    },
  };
};

/** Actual boxes moved is `quantity` — never the warehouse Shipment's own
 * boxQuantity field (section 22). */
export const performDepotRefill = (
  state: VehicleState,
  warehouseShipment: ShipmentDocument,
  quantity: number,
  vehicleCapacity: number,
  depotLocation: Position,
  distanceCalc: DistanceCalculator,
): { state: VehicleState; stop: GeneratedRouteStop } => {
  if (!canRefill(state.currentLoad, quantity, vehicleCapacity)) {
    throw new RouteConstructionError(
      `Cannot refill ${quantity}: would exceed vehicle capacity`,
    );
  }
  return performWarehouseOperation(
    state,
    warehouseShipment,
    quantity,
    "refill",
    depotLocation,
    distanceCalc,
  );
};

export const performDepotUnload = (
  state: VehicleState,
  warehouseShipment: ShipmentDocument,
  quantity: number,
  depotLocation: Position,
  distanceCalc: DistanceCalculator,
): { state: VehicleState; stop: GeneratedRouteStop } => {
  if (!canUnload(state.currentLoad, quantity)) {
    throw new RouteConstructionError(
      `Cannot unload ${quantity}: would go below zero load`,
    );
  }
  return performWarehouseOperation(
    state,
    warehouseShipment,
    -quantity,
    "unload",
    depotLocation,
    distanceCalc,
  );
};

// ---------------------------------------------------------------------------
// Initial load (sections 15 / 16)
// ---------------------------------------------------------------------------

const PLANNING_HORIZON = 8;
const STALENESS_PREVIEW_CAP_HOURS = 48;

const estimateStartPriority = (
  shipment: ShipmentDocument,
  now: Date,
  depotLocation: Position,
): number => {
  const urgencyBoost = shipment.isUrgent ? 1000 : 0;
  const ageHours = Math.max(
    0,
    (now.getTime() - new Date(shipment.createdAt).getTime()) / (1000 * 60 * 60),
  );
  const staleBoost = Math.min(1, ageHours / STALENESS_PREVIEW_CAP_HOURS) * 100;
  const depotDistance = calculateDistance(
    depotLocation,
    shipment.deliverySelected,
  );
  return urgencyBoost + staleBoost - depotDistance;
};

/**
 * Estimates the minimum practical number of delivery boxes needed on the
 * truck at the start of the route — NOT the sum of every delivery's
 * boxQuantity (section 16). Walks a short, priority-ordered preview of the
 * likely opening stops and only accumulates the deficits early deliveries
 * would actually hit, crediting early collections along the way as it goes.
 *
 * This is a planning estimate used to seed the route; the authoritative
 * load at every point is whatever the greedy construction loop in
 * core.optimizer.ts actually produces.
 */
export const calculateInitialLoad = (
  shipments: ShipmentDocument[],
  vehicleCapacity: number,
  now: Date,
  depotLocation: Position,
): number => {
  if (shipments.length === 0 || vehicleCapacity <= 0) return 0;

  const preview = [...shipments]
    .sort(
      (a, b) =>
        estimateStartPriority(b, now, depotLocation) -
        estimateStartPriority(a, now, depotLocation),
    )
    .slice(0, PLANNING_HORIZON);

  let simulatedLoad = 0;
  let requiredInitialLoad = 0;

  for (const shipment of preview) {
    if (shipment.shipmentType === "collection") {
      simulatedLoad += shipment.boxQuantity;
      continue;
    }

    if (simulatedLoad < shipment.boxQuantity) {
      const deficit = shipment.boxQuantity - simulatedLoad;
      requiredInitialLoad += deficit;
      simulatedLoad += deficit;
    }

    simulatedLoad -= shipment.boxQuantity;
  }

  return Math.min(Math.max(requiredInitialLoad, 0), vehicleCapacity);
};
