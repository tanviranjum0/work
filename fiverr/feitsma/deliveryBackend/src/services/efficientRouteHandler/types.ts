import mongoose from "mongoose";

// ---------------------------------------------------------------------------
// Geography
// ---------------------------------------------------------------------------

export interface Position {
  lat: number;
  lng: number;
}

// ---------------------------------------------------------------------------
// Shipment / Route (mirrors the existing Mongoose models)
// ---------------------------------------------------------------------------

export type ShipmentType = "delivery" | "collection";

export interface ShipmentDocument {
  updatedAt: any;
  createdAt: any;
  _id: mongoose.Types.ObjectId;
  OwnerRef: mongoose.Types.ObjectId;
  save?: any;

  clientName: string;
  clientPhoneNumber: number;

  pickupAddress: string;
  deliveryAddress: string;

  isUrgent: boolean;

  deliverySelected: Position;

  routeNumber: string;
  boxQuantity: number;

  driverAllocated: boolean;
  deliveryShift: string;

  shipmentType: ShipmentType;
  status: string;

  note: string;

  /**
   * NEW field — add this to the real Shipment schema (see
   * warehouse.service.ts for the schema/index snippet). Reliably
   * distinguishes the single system-generated warehouse/depot record from
   * ordinary customer collections. Do not identify the warehouse by
   * clientName.
   */
  isWarehouse?: boolean;
}

export interface RouteDocument {
  OwnerRef: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;

  vehicleCapacity: number;
  deliveryShift: string;
  routeNumber: string;

  status: string;
  totalBoxes: number;

  shipments: mongoose.Types.ObjectId[];

  // Optional metadata — add these to the Route schema if you want them
  // persisted. The optimizer always returns them on OptimizerResult
  // regardless, so nothing is lost if you leave the schema as-is and only
  // use the response payload.
  initialLoad?: number;
  maxVehicleLoad?: number;
  totalDistance?: number;
  depotVisitCount?: number;
  feasible?: boolean;
}

// ---------------------------------------------------------------------------
// Request
// ---------------------------------------------------------------------------

export type RouteType = "mixed" | "number";

export interface RouteRequestBody {
  vehicleCapacity: number;
  deliveryShift: string;
  routeType: RouteType;
  routeNumber?: string;
  userId: string;
}

// ---------------------------------------------------------------------------
// Vehicle state
// ---------------------------------------------------------------------------

export interface VehicleState {
  currentLocation: Position;
  currentLocationKey: string;

  currentLoad: number;
  initialLoad: number;
  maxLoad: number;

  totalDistance: number;
  depotVisits: number;

  completedShipmentIds: Set<string>;
}

// ---------------------------------------------------------------------------
// Route stops
// ---------------------------------------------------------------------------

export type WarehouseOperationReason = "initial-load" | "refill" | "unload";

export interface GeneratedRouteStop {
  type: "shipment" | "depot";

  shipmentId?: string;
  shipment?: ShipmentDocument;

  location: Position;

  vehicleLoadBefore: number;
  vehicleLoadAfter: number;

  boxesChanged: number;

  reason?: WarehouseOperationReason;
}

// ---------------------------------------------------------------------------
// Candidates
// ---------------------------------------------------------------------------

export interface ShipmentCandidate {
  type: "shipment";
  shipment: ShipmentDocument;
}

export interface WarehouseRefillCandidate {
  type: "warehouse-refill";
  shipment: ShipmentDocument;
  quantity: number;
}

export interface WarehouseUnloadCandidate {
  type: "warehouse-unload";
  shipment: ShipmentDocument;
  quantity: number;
}

export type Candidate = ShipmentCandidate | WarehouseRefillCandidate | WarehouseUnloadCandidate;

export interface CandidateScore {
  urgencyScore: number;
  staleScore: number;
  distanceScore: number;
  pickupBenefitScore: number;
  futureFeasibilityScore: number;
  capacityScore: number;
  depotPenalty: number;

  totalScore: number;
}

export interface ScoredCandidate {
  candidate: Candidate;
  score: CandidateScore;
}

// ---------------------------------------------------------------------------
// Optimizer result
// ---------------------------------------------------------------------------

export interface OptimizerResult {
  stops: GeneratedRouteStop[];
  feasible: boolean;
  totalDistance: number;
  depotVisitCount: number;
  initialLoad: number;
  maxVehicleLoad: number;
  unassignedShipmentIds: string[];
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/**
 * Thrown internally when a step would violate a capacity invariant — this
 * should be unreachable in normal operation, since every operation is
 * guarded by a feasibility check before it runs. core.optimizer.ts catches
 * it defensively and converts it into `feasible: false` rather than letting
 * it escape as a raw error.
 */
export class RouteConstructionError extends Error {}
