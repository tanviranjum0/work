import { canCollect, canDeliver } from "./capacity.service.js";
import { calculateDistance } from "./distance.service.js";
import {
  Position,
  ShipmentDocument,
  VehicleState,
  WarehouseRefillCandidate,
  WarehouseUnloadCandidate,
} from "./types.js";

export const DEPOT = {
  lat: 52.389285,
  lng: 4.660226,
};

// Cheap tie-break used only to pick which single blocked shipment a depot
// visit is guaranteed to cover at minimum — the real priority scoring
// (urgency/staleness/distance/look-ahead) happens in scoring.service.ts
// once the candidate exists.
const quickBasePriority = (shipment: ShipmentDocument): number =>
  shipment.isUrgent ? 1 : 0;

/**
 * Greedily projects the order the vehicle is likely to visit the
 * remaining shipments in — nearest-first from wherever it currently is,
 * urgent ones pulled forward — so a warehouse visit can be sized for
 * several upcoming stops at once instead of just the one that happened to
 * trigger it. O(n^2) over the remaining set, which stays small in
 * practice; this is a sizing heuristic, not the actual route — the real
 * sequencing is still decided stop-by-stop by the main scorer.
 */
export const projectUpcomingOrder = (
  remaining: ShipmentDocument[],
  from: Position,
): ShipmentDocument[] => {
  const pool = [...remaining];
  const ordered: ShipmentDocument[] = [];
  let currentPosition = from;

  while (pool.length > 0) {
    let bestIndex = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < pool.length; i++) {
      const shipment = pool[i];
      const urgencyBoost = shipment.isUrgent ? 1_000_000 : 0;
      const distance = calculateDistance(
        currentPosition,
        shipment.deliverySelected,
      );
      const score = urgencyBoost - distance;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    const [next] = pool.splice(bestIndex, 1);
    ordered.push(next);
    currentPosition = next.deliverySelected;
  }

  return ordered;
};

/**
 * Builds a warehouse-refill candidate when at least one remaining delivery
 * can't currently be made (section 20). The quantity is the larger of two
 * numbers: (a) the minimum provably needed to unblock the single most
 * important blocked delivery, and (b) the exact amount the projected
 * upcoming order would need to get through without running out again —
 * which lets one refill cover several deliveries in a row instead of
 * forcing a separate depot trip for each, without loading more than what's
 * actually needed. Either way it's capped at *remaining* capacity
 * headroom, never a blanket top-up to full vehicleCapacity for its own
 * sake.
 */
export const maybeBuildRefillCandidate = (
  vehicleState: VehicleState,
  remaining: ShipmentDocument[],
  projected: ShipmentDocument[],
  vehicleCapacity: number,
  warehouseShipment: ShipmentDocument,
): WarehouseRefillCandidate | null => {
  const blockedDeliveries = remaining.filter(
    (s) =>
      s.shipmentType === "delivery" &&
      !canDeliver(vehicleState.currentLoad, s.boxQuantity),
  );

  if (blockedDeliveries.length === 0) return null;

  const headroom = vehicleCapacity - vehicleState.currentLoad;
  if (headroom <= 0) return null;

  const nearestTarget = [...blockedDeliveries].sort(
    (a, b) => quickBasePriority(b) - quickBasePriority(a),
  )[0];
  const minimumNeeded = Math.max(
    0,
    nearestTarget.boxQuantity - vehicleState.currentLoad,
  );

  // Project the vehicle's actual load (starting from what's really on
  // board right now, not from zero) through the upcoming stops, and find
  // the lowest point it would hit without a refill. The shortfall there —
  // how far below zero it would go — is exactly how much extra is needed
  // to get through everything in this projection without running out
  // early. (Getting this right matters: treating the projection's total
  // demand as the refill amount on its own, without netting out load
  // already on board, over-refills by exactly that current load every
  // time.)
  let runningLoad = vehicleState.currentLoad;
  let troughLoad = runningLoad;
  for (const shipment of projected) {
    runningLoad +=
      shipment.shipmentType === "collection"
        ? shipment.boxQuantity
        : -shipment.boxQuantity;
    if (runningLoad < troughLoad) troughLoad = runningLoad;
  }
  const projectedNeed = Math.max(0, -troughLoad);

  const quantity = Math.min(headroom, Math.max(minimumNeeded, projectedNeed));

  return quantity > 0
    ? { type: "warehouse-refill", shipment: warehouseShipment, quantity }
    : null;
};

/**
 * Builds a warehouse-unload candidate when at least one remaining
 * collection can't currently be taken because of capacity (section 21).
 * Sized the same way as the refill above: the larger of the minimum
 * needed for the single most important blocked collection and the peak
 * cumulative load the projected upcoming order would reach — so one
 * unload can make room for several collections in a row — capped at
 * whatever's actually on the vehicle right now.
 */
export const maybeBuildUnloadCandidate = (
  vehicleState: VehicleState,
  remaining: ShipmentDocument[],
  projected: ShipmentDocument[],
  vehicleCapacity: number,
  warehouseShipment: ShipmentDocument,
): WarehouseUnloadCandidate | null => {
  const blockedCollections = remaining.filter(
    (s) =>
      s.shipmentType === "collection" &&
      !canCollect(vehicleState.currentLoad, s.boxQuantity, vehicleCapacity),
  );

  if (blockedCollections.length === 0) return null;
  if (vehicleState.currentLoad <= 0) return null;

  const nearestTarget = [...blockedCollections].sort(
    (a, b) => quickBasePriority(b) - quickBasePriority(a),
  )[0];
  const minimumNeeded = Math.max(
    0,
    vehicleState.currentLoad + nearestTarget.boxQuantity - vehicleCapacity,
  );

  let runningLoad = vehicleState.currentLoad;
  let peakLoad = runningLoad;
  for (const shipment of projected) {
    runningLoad +=
      shipment.shipmentType === "collection"
        ? shipment.boxQuantity
        : -shipment.boxQuantity;
    if (runningLoad > peakLoad) peakLoad = runningLoad;
  }
  const projectedNeed = Math.max(0, peakLoad - vehicleCapacity);

  const quantity = Math.min(
    vehicleState.currentLoad,
    Math.max(minimumNeeded, projectedNeed),
  );

  return quantity > 0
    ? { type: "warehouse-unload", shipment: warehouseShipment, quantity }
    : null;
};
