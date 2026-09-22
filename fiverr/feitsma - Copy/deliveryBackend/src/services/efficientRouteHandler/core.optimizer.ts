import { createDistanceCache } from "./distance.service.js";
import {
  calculateInitialLoad,
  performCollection,
  performDelivery,
  performDepotRefill,
  performDepotUnload,
} from "./capacity.service.js";
import {
  DEPOT,
  maybeBuildRefillCandidate,
  maybeBuildUnloadCandidate,
  projectUpcomingOrder,
} from "./depot.service.js";
import {
  buildShipmentCandidates,
  isExecutableNow,
  scoreCandidates,
  selectBestCandidate,
} from "./candidate.service.js";
import { improveRoute } from "./improvement.service.js";
import { validateGeneratedRoute } from "./validation.service.js";
import {
  Candidate,
  GeneratedRouteStop,
  OptimizerResult,
  RouteConstructionError,
  ShipmentDocument,
  VehicleState,
} from "./types.js";

export interface ConstructRouteParams {
  mode: "mixed" | "numbered";
  shipments: ShipmentDocument[]; // customer shipments only — never the warehouse doc
  warehouseShipment: ShipmentDocument;
  vehicleCapacity: number;
  now: Date;
}

const MAX_ITERATIONS_PER_SHIPMENT = 4;
const SAFETY_ITERATION_FLOOR = 20;

/**
 * Shared route-construction engine used by both the mixed and numbered
 * optimizers. The candidate-scoring / greedy-selection / warehouse-
 * insertion loop is identical between the two route types — only the
 * candidate pool and the termination rule differ (mixed may stop early and
 * leave a subset unassigned; numbered may not) — so it lives once here
 * rather than being duplicated across mixedRoute.optimizer.ts and
 * numberedRoute.optimizer.ts.
 *
 * Pipeline (section 35): initial-load estimate → greedy candidate
 * selection with bounded look-ahead → conditional warehouse insertion →
 * bounded local-search improvement → final feasibility validation. No
 * permutation search, no recursion — everything here is polynomial in the
 * number of shipments.
 *
 * Urgent shipments (isUrgent: true) are an absolute priority: every
 * candidate the loop considers is drawn exclusively from whatever urgent
 * shipments remain until none are left, and warehouse visits triggered
 * while urgent shipments remain are sized/targeted only at unblocking
 * those. improveRoute's local-search pass is separately guarded (see
 * improvement.service.ts) so it can never reorder a non-urgent stop ahead
 * of an urgent one afterward.
 */
export const constructRoute = ({
  mode,
  shipments,
  warehouseShipment,
  vehicleCapacity,
  now,
}: ConstructRouteParams): OptimizerResult => {
  const { calculateDistance: distanceCalc } = createDistanceCache();

  const initialLoad = calculateInitialLoad(
    shipments,
    vehicleCapacity,
    now,
    DEPOT,
  );

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

  const remaining = new Map<string, ShipmentDocument>(
    shipments.map((s) => [s._id.toString(), s]),
  );
  const maxIterations = Math.max(
    SAFETY_ITERATION_FLOOR,
    shipments.length * MAX_ITERATIONS_PER_SHIPMENT,
  );

  let iterations = 0;
  let infeasible = false;

  try {
    while (remaining.size > 0 && iterations < maxIterations) {
      iterations += 1;

      const remainingList = Array.from(remaining.values());

      // Urgent shipments are an absolute priority, not just a scoring
      // boost: as long as any urgent shipment is still incomplete, every
      // candidate-generation, scoring, and warehouse-targeting step below
      // only considers urgent shipments — non-urgent ones are invisible to
      // the optimizer until every urgent shipment has been delivered or
      // collected. Only once none remain does it fall back to the normal
      // full pool.
      const hasUrgentRemaining = remainingList.some((s) => s.isUrgent);
      const priorityPool = hasUrgentRemaining ? remainingList.filter((s) => s.isUrgent) : remainingList;

      const shipmentCandidates = buildShipmentCandidates(priorityPool);
      const scoredShipments = scoreCandidates(
        shipmentCandidates,
        vehicleState,
        priorityPool,
        vehicleCapacity,
        distanceCalc,
        now,
      );
      const executable = scoredShipments.filter((sc) =>
        isExecutableNow(sc.candidate, vehicleState, vehicleCapacity),
      );

      if (executable.length > 0) {
        const chosen = selectBestCandidate(executable);

        if (chosen && chosen.candidate.type === "shipment") {
          const { shipment } = chosen.candidate;
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
          remaining.delete(shipment._id.toString());
          continue;
        }
      }

      // Nothing directly executable — see whether a depot visit unblocks
      // anything. Sized/targeted against the same priorityPool, so a
      // warehouse visit triggered while urgent shipments remain is aimed
      // at unblocking those, not at batching in non-urgent demand.
      const projected = projectUpcomingOrder(
        priorityPool,
        vehicleState.currentLocation,
      );
      const refillCandidate = maybeBuildRefillCandidate(
        vehicleState,
        priorityPool,
        projected,
        vehicleCapacity,
        warehouseShipment,
      );
      const unloadCandidate = maybeBuildUnloadCandidate(
        vehicleState,
        priorityPool,
        projected,
        vehicleCapacity,
        warehouseShipment,
      );
      const warehouseCandidates = (
        [refillCandidate, unloadCandidate] as (Candidate | null)[]
      ).filter((c): c is Candidate => c !== null);

      if (warehouseCandidates.length > 0) {
        const scoredWarehouse = scoreCandidates(
          warehouseCandidates,
          vehicleState,
          priorityPool,
          vehicleCapacity,
          distanceCalc,
          now,
        );
        const chosen = selectBestCandidate(scoredWarehouse);

        if (chosen?.candidate.type === "warehouse-refill") {
          const { state, stop } = performDepotRefill(
            vehicleState,
            warehouseShipment,
            chosen.candidate.quantity,
            vehicleCapacity,
            DEPOT,
            distanceCalc,
          );
          vehicleState = state;
          stops.push(stop);
          continue;
        }

        if (chosen?.candidate.type === "warehouse-unload") {
          const { state, stop } = performDepotUnload(
            vehicleState,
            warehouseShipment,
            chosen.candidate.quantity,
            DEPOT,
            distanceCalc,
          );
          vehicleState = state;
          stops.push(stop);
          continue;
        }
      }

      // Genuinely stuck: nothing is executable and no depot visit helps.
      if (mode === "mixed") break; // leave the rest unassigned — mixed routes may select a subset (section 23)

      infeasible = true; // numbered routes must include every required shipment (section 25) — this is a hard failure
      break;
    }
  } catch (err) {
    if (err instanceof RouteConstructionError) {
      infeasible = true;
    } else {
      throw err;
    }
  }

  const unassignedShipmentIds = Array.from(remaining.keys());

  if (infeasible || (mode === "numbered" && unassignedShipmentIds.length > 0)) {
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
  const requiredIds =
    mode === "numbered" ? shipments.map((s) => s._id.toString()) : null;
  const validation = validateGeneratedRoute(
    improvedStops,
    vehicleCapacity,
    requiredIds,
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