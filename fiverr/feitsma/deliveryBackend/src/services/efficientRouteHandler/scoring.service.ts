import { DistanceCalculator } from "./distance.service.js";
import { DEPOT } from "./depot.service.js";
import {
  Candidate,
  CandidateScore,
  ShipmentDocument,
  VehicleState,
} from "./types.js";

// ---------------------------------------------------------------------------
// Configuration — every weight lives here, nowhere else (section 18).
// ---------------------------------------------------------------------------

export const ROUTE_WEIGHTS = {
  urgent: 500,
  stale: 150,
  distance: 8,
  pickupBenefit: 120,
  futureFeasibility: 90,
  futureFeasibilityUrgentBonus: 60,
  capacityRisk: 200,
  depotPenalty: 140,
};

export const STALENESS_CAP_HOURS = 48;
export const LOOKAHEAD_WINDOW = 3; // 2–4 stops, per section 17

// ---------------------------------------------------------------------------
// Staleness
// ---------------------------------------------------------------------------

export const calculateStaleness = (
  shipment: ShipmentDocument,
  now: Date,
): number => {
  const createdAt = new Date(shipment.createdAt).getTime();
  if (Number.isNaN(createdAt)) return 0;

  const ageHours = Math.max(0, (now.getTime() - createdAt) / (1000 * 60 * 60));
  return Math.min(1, ageHours / STALENESS_CAP_HOURS);
};

// ---------------------------------------------------------------------------
// Future feasibility — bounded look-ahead (sections 17 / 27)
// ---------------------------------------------------------------------------

const simulateApply = (shipment: ShipmentDocument, load: number): number =>
  shipment.shipmentType === "delivery"
    ? load - shipment.boxQuantity
    : load + shipment.boxQuantity;

const isFeasibleAt = (
  shipment: ShipmentDocument,
  load: number,
  vehicleCapacity: number,
): boolean =>
  shipment.shipmentType === "delivery"
    ? load >= shipment.boxQuantity
    : load + shipment.boxQuantity <= vehicleCapacity;

const quickPriority = (shipment: ShipmentDocument, now: Date): number =>
  (shipment.isUrgent ? 1000 : 0) + calculateStaleness(shipment, now) * 100;

/**
 * Simulates taking `candidate`, then checks whether any of the top
 * LOOKAHEAD_WINDOW remaining shipments — ranked by a cheap priority
 * heuristic, not the full scorer, to keep this bounded — flip from
 * infeasible to feasible as a result. This is what lets a collection
 * "unlock" a delivery a few stops out (section 27) without recursive or
 * exhaustive search.
 */
export const estimateFutureFeasibility = (
  candidate: Candidate,
  vehicleState: VehicleState,
  remaining: ShipmentDocument[],
  vehicleCapacity: number,
  now: Date,
): number => {
  const candidateShipmentId =
    candidate.type === "shipment" ? candidate.shipment._id.toString() : null;

  const loadBefore = vehicleState.currentLoad;
  const loadAfter =
    candidate.type === "shipment"
      ? simulateApply(candidate.shipment, loadBefore)
      : candidate.type === "warehouse-refill"
        ? loadBefore + candidate.quantity
        : loadBefore - candidate.quantity;

  const others = candidateShipmentId
    ? remaining.filter((s) => s._id.toString() !== candidateShipmentId)
    : remaining;
  const ranked = [...others]
    .sort((a, b) => quickPriority(b, now) - quickPriority(a, now))
    .slice(0, LOOKAHEAD_WINDOW);

  let score = 0;

  for (const shipment of ranked) {
    const wasFeasible = isFeasibleAt(shipment, loadBefore, vehicleCapacity);
    const becomesFeasible = isFeasibleAt(shipment, loadAfter, vehicleCapacity);

    if (!wasFeasible && becomesFeasible) {
      score += ROUTE_WEIGHTS.futureFeasibility;
      if (shipment.isUrgent)
        score += ROUTE_WEIGHTS.futureFeasibilityUrgentBonus;
    }
  }

  return score;
};

// ---------------------------------------------------------------------------
// Pickup benefit — general usefulness of a collection against total pending
// delivery demand, independent of the specific look-ahead window above.
// ---------------------------------------------------------------------------

const calculatePickupBenefitScore = (
  candidate: Candidate,
  remaining: ShipmentDocument[],
): number => {
  if (
    candidate.type !== "shipment" ||
    candidate.shipment.shipmentType !== "collection"
  )
    return 0;

  const totalPendingDeliveryBoxes = remaining
    .filter((s) => s.shipmentType === "delivery")
    .reduce((sum, s) => sum + s.boxQuantity, 0);

  if (totalPendingDeliveryBoxes <= 0) return 0;

  const contributionRatio = Math.min(
    1,
    candidate.shipment.boxQuantity / totalPendingDeliveryBoxes,
  );
  return contributionRatio * ROUTE_WEIGHTS.pickupBenefit;
};

// ---------------------------------------------------------------------------
// Capacity risk — penalize candidates that push utilization to an extreme
// (near-full risks blocking the next collection, near-empty-with-deliveries-
// pending risks blocking the next delivery).
// ---------------------------------------------------------------------------

const calculateCapacityScore = (
  candidate: Candidate,
  vehicleState: VehicleState,
  vehicleCapacity: number,
): number => {
  if (candidate.type !== "shipment" || vehicleCapacity <= 0) return 0;

  const resultingLoad = simulateApply(
    candidate.shipment,
    vehicleState.currentLoad,
  );
  const utilization = resultingLoad / vehicleCapacity;

  const nearFullRisk =
    utilization > 0.85 ? (utilization - 0.85) * ROUTE_WEIGHTS.capacityRisk : 0;
  const nearEmptyRisk =
    utilization < 0.15 ? (0.15 - utilization) * ROUTE_WEIGHTS.capacityRisk : 0;

  return -(nearFullRisk + nearEmptyRisk);
};

// ---------------------------------------------------------------------------
// Main scorer (section 18)
// ---------------------------------------------------------------------------

export const calculateCandidateScore = (
  candidate: Candidate,
  vehicleState: VehicleState,
  remaining: ShipmentDocument[],
  vehicleCapacity: number,
  distanceCalc: DistanceCalculator,
  now: Date,
): CandidateScore => {
  const isWarehouseCandidate =
    candidate.type === "warehouse-refill" ||
    candidate.type === "warehouse-unload";
  const targetLocation = isWarehouseCandidate
    ? DEPOT
    : candidate.shipment.deliverySelected;
  const targetKey = isWarehouseCandidate
    ? "DEPOT"
    : candidate.shipment._id.toString();

  const distance = distanceCalc(
    { ...vehicleState.currentLocation, key: vehicleState.currentLocationKey },
    { ...targetLocation, key: targetKey },
  );

  const urgencyScore =
    candidate.type === "shipment" && candidate.shipment.isUrgent
      ? ROUTE_WEIGHTS.urgent
      : 0;
  const staleScore =
    candidate.type === "shipment"
      ? calculateStaleness(candidate.shipment, now) * ROUTE_WEIGHTS.stale
      : 0;
  const distanceScore = -(distance * ROUTE_WEIGHTS.distance);
  const pickupBenefitScore = calculatePickupBenefitScore(candidate, remaining);
  const futureFeasibilityScore = estimateFutureFeasibility(
    candidate,
    vehicleState,
    remaining,
    vehicleCapacity,
    now,
  );
  const capacityScore = calculateCapacityScore(
    candidate,
    vehicleState,
    vehicleCapacity,
  );
  const depotPenalty = isWarehouseCandidate ? -ROUTE_WEIGHTS.depotPenalty : 0;

  const totalScore =
    urgencyScore +
    staleScore +
    distanceScore +
    pickupBenefitScore +
    futureFeasibilityScore +
    capacityScore +
    depotPenalty;

  return {
    urgencyScore,
    staleScore,
    distanceScore,
    pickupBenefitScore,
    futureFeasibilityScore,
    capacityScore,
    depotPenalty,
    totalScore,
  };
};
