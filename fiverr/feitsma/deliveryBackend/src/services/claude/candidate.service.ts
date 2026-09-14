import { calculateCandidateScore } from "./scoring.service.js";
import { canCollect, canDeliver } from "./capacity.service.js";
import { DistanceCalculator } from "./distance.service.js";
import {
  Candidate,
  ScoredCandidate,
  ShipmentDocument,
  VehicleState,
} from "./types.js";

/** The warehouse is never a plain shipment candidate (section 12) — only
 * ordinary customer shipments come through here. Warehouse candidates are
 * built separately, conditionally, in depot.service.ts. */
export const buildShipmentCandidates = (
  remaining: ShipmentDocument[],
): Candidate[] =>
  remaining.map((shipment) => ({ type: "shipment", shipment }) as Candidate);

export const isExecutableNow = (
  candidate: Candidate,
  vehicleState: VehicleState,
  vehicleCapacity: number,
): boolean => {
  if (candidate.type !== "shipment") return true; // warehouse candidates are only ever built once they're already valid to run

  return candidate.shipment.shipmentType === "delivery"
    ? canDeliver(vehicleState.currentLoad, candidate.shipment.boxQuantity)
    : canCollect(
        vehicleState.currentLoad,
        candidate.shipment.boxQuantity,
        vehicleCapacity,
      );
};

export const scoreCandidates = (
  candidates: Candidate[],
  vehicleState: VehicleState,
  remaining: ShipmentDocument[],
  vehicleCapacity: number,
  distanceCalc: DistanceCalculator,
  now: Date,
): ScoredCandidate[] =>
  candidates.map((candidate) => ({
    candidate,
    score: calculateCandidateScore(
      candidate,
      vehicleState,
      remaining,
      vehicleCapacity,
      distanceCalc,
      now,
    ),
  }));

/** Deterministic tie-break, per the "deterministic and explainable"
 * requirement (section 37): highest total score wins; ties break on
 * shipment id so identical input always produces the identical route. */
export const selectBestCandidate = (
  scored: ScoredCandidate[],
): ScoredCandidate | null => {
  if (scored.length === 0) return null;

  return [...scored].sort((a, b) => {
    if (b.score.totalScore !== a.score.totalScore)
      return b.score.totalScore - a.score.totalScore;

    const idA = a.candidate.shipment._id.toString();
    const idB = b.candidate.shipment._id.toString();
    return idA < idB ? -1 : idA > idB ? 1 : 0;
  })[0];
};
