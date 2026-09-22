import { calculateDistance, createDistanceCache } from "./distance.service.js";
import { performCollection, performDelivery } from "./capacity.service.js";
import { DEPOT } from "./depot.service.js";
import { calculateStaleness } from "./scoring.service.js";
import { improveRoute } from "./improvement.service.js";
import { validateGeneratedRoute } from "./validation.service.js";
import {
  GeneratedRouteStop,
  OptimizerResult,
  RouteConstructionError,
  ShipmentDocument,
  VehicleState,
} from "./types.js";

const MAX_MIXED_ROUTE_SHIPMENTS = 3;

/**
 * Ranks candidates highest-priority-first: urgent ones pulled to the
 * front, then a nearest-neighbor walk from the depot outward (favoring
 * older/staler shipments as a tiebreaker). This is a separate, smaller
 * heuristic from depot.service.ts's projectUpcomingOrder — that one
 * projects *physical visiting order* for sizing a warehouse visit;
 * this one ranks *which shipments deserve a seat* on a route that will
 * never make a warehouse visit at all, so it also weighs staleness,
 * which visiting-order projection has no reason to care about.
 */
const rankByPriority = (
  candidates: ShipmentDocument[],
  now: Date,
): ShipmentDocument[] => {
  const pool = [...candidates];
  const ranked: ShipmentDocument[] = [];
  let currentPosition = DEPOT;

  while (pool.length > 0) {
    let bestIndex = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < pool.length; i++) {
      const shipment = pool[i];
      const urgencyBoost = shipment.isUrgent ? 1_000_000 : 0;
      const staleBoost = calculateStaleness(shipment, now) * 1000;
      const distance = calculateDistance(
        currentPosition,
        shipment.deliverySelected,
      );
      const score = urgencyBoost + staleBoost - distance;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    const [next] = pool.splice(bestIndex, 1);
    ranked.push(next);
    currentPosition = next.deliverySelected;
  }

  return ranked;
};

/**
 * Mixed-route optimizer — deliberately simple and single-pass, with no
 * warehouse stops at all: a shipment that would need a refill or unload
 * to fit is just skipped, not deferred or worked around. Walks candidates
 * in priority order exactly once, greedily keeping up to
 * MAX_MIXED_ROUTE_SHIPMENTS of them — a candidate is kept only if the
 * route stays capacity-feasible for *some* initial load between 0 and
 * vehicleCapacity with it included; otherwise it's left out and the walk
 * moves on. It never backtracks to try a different combination and never
 * goes looking for more once it has 3 (or has run out of candidates).
 */
export const runMixedRouteOptimizer = (
  shipments: ShipmentDocument[],
  warehouseShipment: ShipmentDocument,
  vehicleCapacity: number,
  now: Date = new Date(),
): OptimizerResult => {
  const { calculateDistance: distanceCalc } = createDistanceCache();

  const ranked = rankByPriority(shipments, now);

  const chosen: ShipmentDocument[] = [];
  let cumulativeDelta = 0; // net change from an assumed starting point of 0
  let trough = 0; // lowest point that running total has reached
  let peak = 0; // highest point that running total has reached

  for (const candidate of ranked) {
    if (chosen.length >= MAX_MIXED_ROUTE_SHIPMENTS) break;

    const delta =
      candidate.shipmentType === "collection"
        ? candidate.boxQuantity
        : -candidate.boxQuantity;
    const nextCumulative = cumulativeDelta + delta;
    const nextTrough = Math.min(trough, nextCumulative);
    const nextPeak = Math.max(peak, nextCumulative);

    // The minimum initial load that keeps every prefix non-negative, and
    // the highest load that load would ever reach given that starting
    // point — if that peak fits under capacity, this candidate can join
    // without ever needing a warehouse stop.
    const requiredInitialLoad = Math.max(0, -nextTrough);
    const maxLoadReached = requiredInitialLoad + nextPeak;
    const fits =
      requiredInitialLoad <= vehicleCapacity &&
      maxLoadReached <= vehicleCapacity;

    if (!fits) continue; // doesn't fit without a warehouse stop — skip it, keep walking

    chosen.push(candidate);
    cumulativeDelta = nextCumulative;
    trough = nextTrough;
    peak = nextPeak;
  }

  const chosenIds = new Set(chosen.map((s) => s._id.toString()));
  const unassignedShipmentIds = shipments
    .filter((s) => !chosenIds.has(s._id.toString()))
    .map((s) => s._id.toString());

  if (chosen.length === 0) {
    return {
      stops: [],
      feasible: false,
      totalDistance: 0,
      depotVisitCount: 0,
      initialLoad: 0,
      maxVehicleLoad: 0,
      unassignedShipmentIds,
    };
  }

  const initialLoad = Math.max(0, -trough);

  let vehicleState: VehicleState = {
    currentLocation: { ...DEPOT },
    currentLocationKey: "DEPOT",
    currentLoad: initialLoad,
    initialLoad,
    maxLoad: initialLoad,
    totalDistance: 0,
    depotVisits: 1,
    completedShipmentIds: new Set<string>(),
  };

  const stops: GeneratedRouteStop[] = [
    {
      type: "depot",
      shipmentId: warehouseShipment._id.toString(),
      shipment: warehouseShipment,
      location: { ...DEPOT },
      vehicleLoadBefore: 0,
      vehicleLoadAfter: initialLoad,
      boxesChanged: initialLoad,
      reason: "initial-load",
    },
  ];

  try {
    for (const shipment of chosen) {
      const { state, stop } =
        shipment.shipmentType === "delivery"
          ? performDelivery(vehicleState, shipment, distanceCalc)
          : performCollection(
              vehicleState,
              shipment,
              vehicleCapacity,
              distanceCalc,
            );

      vehicleState = state;
      stops.push(stop);
    }
  } catch (err) {
    if (!(err instanceof RouteConstructionError)) throw err;

    // Should be unreachable — the trough/peak check above already proved
    // this exact sequence is feasible — but fail safe rather than crash
    // if it's ever wrong.
    return {
      stops,
      feasible: false,
      totalDistance: vehicleState.totalDistance,
      depotVisitCount: vehicleState.depotVisits,
      initialLoad,
      maxVehicleLoad: vehicleState.maxLoad,
      unassignedShipmentIds,
    };
  }

  const { stops: improvedStops, totalDistance } = improveRoute(
    stops,
    vehicleCapacity,
    distanceCalc,
  );
  const validation = validateGeneratedRoute(
    improvedStops,
    vehicleCapacity,
    null,
  );

  return {
    stops: improvedStops,
    feasible: validation.valid,
    totalDistance,
    depotVisitCount: vehicleState.depotVisits,
    initialLoad,
    maxVehicleLoad: vehicleState.maxLoad,
    unassignedShipmentIds,
  };
};
