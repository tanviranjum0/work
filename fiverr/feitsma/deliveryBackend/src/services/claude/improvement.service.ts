import { DistanceCalculator, KeyedPosition } from "./distance.service.js";
import { GeneratedRouteStop } from "./types.js";

const EPSILON = 1e-9;
const MAX_SEGMENT_LENGTH_FOR_2OPT = 40;
const MAX_SEGMENT_LENGTH_FOR_RELOCATE = 20;

interface Segment {
  startIndex: number;
  endIndex: number; // inclusive
  entryLocation: KeyedPosition;
  entryLoad: number;
}

const keyFor = (stop: GeneratedRouteStop): string =>
  stop.type === "depot" ? "DEPOT" : (stop.shipmentId as string);

const toKeyedPosition = (stop: GeneratedRouteStop): KeyedPosition => ({
  lat: stop.location.lat,
  lng: stop.location.lng,
  key: keyFor(stop),
});

/**
 * Splits stops into the runs of consecutive shipment stops between depot
 * visits. A run's shipments and their boxesChanged deltas never change
 * during reordering (same set, same deltas) — only the order does — so its
 * entry/exit load is always preserved and it's safe to optimize each run
 * independently.
 */
const splitIntoSegments = (stops: GeneratedRouteStop[]): Segment[] => {
  const segments: Segment[] = [];
  let i = 0;

  while (i < stops.length) {
    if (stops[i].type === "depot") {
      i += 1;
      continue;
    }

    const startIndex = i;
    while (i < stops.length && stops[i].type === "shipment") i += 1;
    const endIndex = i - 1;

    const beforeStop = stops[startIndex - 1];
    segments.push({
      startIndex,
      endIndex,
      entryLocation: toKeyedPosition(beforeStop),
      entryLoad: beforeStop.vehicleLoadAfter,
    });
  }

  return segments;
};

const segmentDistance = (
  entryLocation: KeyedPosition,
  stops: GeneratedRouteStop[],
  distanceCalc: DistanceCalculator,
): number => {
  let total = 0;
  let prev = entryLocation;

  for (const stop of stops) {
    const here = toKeyedPosition(stop);
    total += distanceCalc(prev, here);
    prev = here;
  }

  return total;
};

const isReorderFeasible = (
  entryLoad: number,
  stops: GeneratedRouteStop[],
  vehicleCapacity: number,
): boolean => {
  let load = entryLoad;

  for (const stop of stops) {
    load += stop.boxesChanged;
    if (load < 0 || load > vehicleCapacity) return false;
  }

  return true;
};

/**
 * Urgent shipments must stay ahead of every non-urgent one — not just
 * scored higher, but never reordered behind one. A candidate reordering
 * is rejected here the moment any stop appears after a non-urgent stop
 * while itself being urgent, i.e. the moment the urgent stops stop being
 * a clean prefix of the segment.
 */
const preservesUrgencyOrder = (stops: GeneratedRouteStop[]): boolean => {
  let seenNonUrgent = false;

  for (const stop of stops) {
    const isUrgent = stop.shipment?.isUrgent === true;

    if (isUrgent && seenNonUrgent) return false;
    if (!isUrgent) seenNonUrgent = true;
  }

  return true;
};

const recomputeStops = (
  entryLoad: number,
  stops: GeneratedRouteStop[],
): GeneratedRouteStop[] => {
  let load = entryLoad;

  return stops.map((stop) => {
    const vehicleLoadBefore = load;
    load += stop.boxesChanged;
    return { ...stop, vehicleLoadBefore, vehicleLoadAfter: load };
  });
};

const reversedRange = (
  stops: GeneratedRouteStop[],
  i: number,
  j: number,
): GeneratedRouteStop[] => {
  const copy = [...stops];
  let left = i;
  let right = j;
  while (left < right) {
    const tmp = copy[left];
    copy[left] = copy[right];
    copy[right] = tmp;
    left += 1;
    right -= 1;
  }
  return copy;
};

const relocated = (
  stops: GeneratedRouteStop[],
  from: number,
  to: number,
): GeneratedRouteStop[] => {
  const copy = [...stops];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};

/**
 * Bounded 2-opt: tries reversing sub-ranges, keeps a reversal only if it
 * shortens the segment's distance AND every intermediate load stays within
 * [0, vehicleCapacity]. Capped passes and segment length keep this
 * polynomial rather than exhaustive (section 35).
 */
const run2Opt = (
  entryLocation: KeyedPosition,
  entryLoad: number,
  stops: GeneratedRouteStop[],
  vehicleCapacity: number,
  distanceCalc: DistanceCalculator,
): GeneratedRouteStop[] => {
  if (stops.length < 3 || stops.length > MAX_SEGMENT_LENGTH_FOR_2OPT)
    return stops;

  let current = stops;
  let bestDistance = segmentDistance(entryLocation, current, distanceCalc);

  for (let pass = 0; pass < 2; pass++) {
    let improved = false;

    for (let i = 0; i < current.length - 1; i++) {
      for (let j = i + 1; j < current.length; j++) {
        const candidate = reversedRange(current, i, j);
        const candidateDistance = segmentDistance(
          entryLocation,
          candidate,
          distanceCalc,
        );

        if (
          candidateDistance < bestDistance - EPSILON &&
          isReorderFeasible(entryLoad, candidate, vehicleCapacity) &&
          preservesUrgencyOrder(candidate)
        ) {
          current = candidate;
          bestDistance = candidateDistance;
          improved = true;
        }
      }
    }

    if (!improved) break;
  }

  return current;
};

/**
 * Bounded relocate: tries moving each single stop to every other position
 * in a (small) segment, keeping the move only if it shortens the distance
 * and stays feasible. Runs after 2-opt, on smaller segments only, so the
 * combined cost stays bounded.
 */
const runRelocate = (
  entryLocation: KeyedPosition,
  entryLoad: number,
  stops: GeneratedRouteStop[],
  vehicleCapacity: number,
  distanceCalc: DistanceCalculator,
): GeneratedRouteStop[] => {
  if (stops.length < 3 || stops.length > MAX_SEGMENT_LENGTH_FOR_RELOCATE)
    return stops;

  let current = stops;
  let bestDistance = segmentDistance(entryLocation, current, distanceCalc);

  for (let pass = 0; pass < 2; pass++) {
    let improved = false;

    for (let from = 0; from < current.length; from++) {
      for (let to = 0; to < current.length; to++) {
        if (from === to) continue;

        const candidate = relocated(current, from, to);
        const candidateDistance = segmentDistance(
          entryLocation,
          candidate,
          distanceCalc,
        );

        if (
          candidateDistance < bestDistance - EPSILON &&
          isReorderFeasible(entryLoad, candidate, vehicleCapacity) &&
          preservesUrgencyOrder(candidate)
        ) {
          current = candidate;
          bestDistance = candidateDistance;
          improved = true;
        }
      }
    }

    if (!improved) break;
  }

  return current;
};

/**
 * Runs the local-improvement pass (2-opt then relocate) over every
 * depot-bounded segment of the route (section 29) and returns the improved
 * stop list plus the recomputed total distance. Never changes which
 * shipments are included, never reorders across a depot stop, never
 * touches depot stops themselves, and never moves a non-urgent stop ahead
 * of an urgent one — see preservesUrgencyOrder above. This is what keeps
 * urgent-first intact after construction for both route types, since both
 * mixedRoute.optimizer.ts and core.optimizer.ts call this same function.
 */
export const improveRoute = (
  stops: GeneratedRouteStop[],
  vehicleCapacity: number,
  distanceCalc: DistanceCalculator,
): { stops: GeneratedRouteStop[]; totalDistance: number } => {
  if (stops.length === 0) return { stops, totalDistance: 0 };

  const segments = splitIntoSegments(stops);
  let result = [...stops];

  for (const segment of segments) {
    const segmentStops = result.slice(segment.startIndex, segment.endIndex + 1);
    const after2Opt = run2Opt(
      segment.entryLocation,
      segment.entryLoad,
      segmentStops,
      vehicleCapacity,
      distanceCalc,
    );
    const afterRelocate = runRelocate(
      segment.entryLocation,
      segment.entryLoad,
      after2Opt,
      vehicleCapacity,
      distanceCalc,
    );
    const recomputed = recomputeStops(segment.entryLoad, afterRelocate);

    result = [
      ...result.slice(0, segment.startIndex),
      ...recomputed,
      ...result.slice(segment.endIndex + 1),
    ];
  }

  const totalDistance = recomputeTotalDistance(result, distanceCalc);
  return { stops: result, totalDistance };
};

const recomputeTotalDistance = (
  stops: GeneratedRouteStop[],
  distanceCalc: DistanceCalculator,
): number => {
  let total = 0;
  let prev: KeyedPosition | null = null;

  for (const stop of stops) {
    const here = toKeyedPosition(stop);
    if (prev) total += distanceCalc(prev, here);
    prev = here;
  }

  return total;
};