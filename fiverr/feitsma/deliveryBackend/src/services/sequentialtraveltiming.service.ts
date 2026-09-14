import { Request, Response } from "express";
import axios from "axios";
// import Route from "../models/Route.js";
const MAX_REQUESTS_PER_SECOND = 5;
const REQUEST_INTERVAL_MS = 1000 / MAX_REQUESTS_PER_SECOND;

class GeoapifyRateLimiter {
  private nextAvailableAt = 0;
  private queue: Promise<void> = Promise.resolve();

  acquire(): Promise<void> {
    const acquireSlot = async (): Promise<void> => {
      const now = Date.now();
      const waitMs = Math.max(0, this.nextAvailableAt - now);

      if (waitMs > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, waitMs));
      }

      const startedAt = Date.now();
      this.nextAvailableAt =
        Math.max(this.nextAvailableAt, startedAt) + REQUEST_INTERVAL_MS;
    };

    const slot = this.queue.then(acquireSlot, acquireSlot);
    this.queue = slot.catch(() => undefined);

    return slot;
  }
}

const geoapifyRateLimiter = new GeoapifyRateLimiter();
// ═════════════════════════════════════════════════════════════════════════════
// SEQUENTIAL TRAVEL TIMING SERVICE
// ═════════════════════════════════════════════════════════════════════════════
//
// Given an ORDERED array of shipments (each with a `deliverySelected` lat/lng),
// this service computes the travel time FROM each shipment TO the next one,
// using Geoapify's Routing API for the underlying point-to-point lookups.
//
// Design notes:
//
//   • The FIRST shipment in the array never gets a travel time — there is no
//     "previous stop" to measure from. All of its timing fields are `null`.
//
//   • Every OTHER shipment gets `travelTimeFromPreviousSeconds`, computed as
//     (Geoapify's driving time for that specific leg) + a fixed 10-minute
//     service buffer, representing loading/unloading/dwell time at the
//     PREVIOUS stop before the driver departs for this one.
//
//   • This endpoint intentionally returns PER-LEG durations, not absolute
//     timestamps. The frontend adds these durations to whatever "now" is at
//     render time to produce a live, always-current ETA — computing an
//     absolute time server-side would go stale the moment the response
//     leaves the server.
//
//   • EFFICIENCY: leg[i]'s duration depends only on shipment[i-1] and
//     shipment[i]'s coordinates — it has no dependency on any other leg's
//     result. That means every leg can be fetched CONCURRENTLY rather than
//     one after another. `mapWithConcurrencyLimit` below runs them in
//     parallel, capped at a configurable concurrency (default 6) so a
//     large shipment list doesn't fire dozens of simultaneous requests at
//     Geoapify and risk tripping its rate limits (HTTP 429).
//
//   • RESILIENCE: if one leg's lookup fails (e.g. "No route found" between
//     two specific points), that failure is isolated to just that shipment
//     — its timing fields become `null` with an explanatory
//     `travelTimeError`, and every other leg is unaffected. The endpoint
//     still returns 200 with a `warnings` array, rather than failing the
//     entire request over one bad leg.
//
// No new NPM dependencies — this reuses `axios`, already used by the sample
// Geoapify wrapper this service is built on.
// ═════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────────────────────────────────────────

/** A plain lat/lng pair. Named distinctly from `Location` to avoid colliding
 *  with the DOM `Location` global some tsconfigs pull in, and to match the
 *  `PositionLatLng` naming convention used elsewhere in this routing system. */
export interface GeoCoordinates {
  lat: number;
  lng: number;
}

/** Result of a single Geoapify point-to-point routing lookup. */
export interface DistanceTimeResult {
  /** Kilometers. */
  distance: number;
  /** Seconds. */
  time: number;
}

/** The minimum shape a shipment must have to be timed by this service.
 *  Declared as a generic constraint (see `attachSequentialTravelTimes`) so
 *  callers can pass full `IShipment` documents, lean objects, or anything
 *  else that carries a `deliverySelected` location — the extra fields on
 *  whatever type is passed in are preserved untouched in the response. */
export interface HasDeliveryLocation {
  deliverySelected: GeoCoordinates;
}

/** The fields this service adds to every shipment it processes. */
export interface SequentialTravelTiming {
  isFirstStop: boolean;
  travelTimeFromPreviousSeconds: number | null;
  travelTimeFromPreviousMinutes: number | null;
  distanceFromPreviousKm: number | null;
  travelTimeError: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const GEOAPIFY_ROUTING_URL = "https://api.geoapify.com/v1/routing";

/** Dwell time added between every consecutive pair of shipments — covers
 *  loading/unloading boxes and paperwork at the previous stop before the
 *  driver departs for the next one. Overridable per-request (see the
 *  handler's `serviceBufferMinutes` body option). */
const DEFAULT_SERVICE_BUFFER_SECONDS = 10 * 60;

/** Maximum number of Geoapify requests in flight at once. Overridable per
 *  request via the `concurrency` body option — lower this if you start
 *  seeing 429 (rate limit) responses from Geoapify. */
const DEFAULT_CONCURRENCY = 6;

// ─────────────────────────────────────────────────────────────────────────────
// 3. GEOAPIFY ROUTING WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
//
// This is the same pattern as the sample handler provided — kept as a
// standalone, reusable utility. If you already have an identical
// `getDistanceTime` elsewhere in your codebase (e.g. a `geoapify.service.ts`),
// you can delete this copy and import that one instead; the two are
// functionally interchangeable.

/**
 * Calls Geoapify's Routing API for a single origin → destination pair.
 * Returns distance in kilometers and travel time in seconds (raw driving
 * time — the service buffer is added separately by the caller, keeping
 * this function a pure, unmodified wrapper around the third-party API).
 */
export const getDistanceTime = async (
  origin: GeoCoordinates,
  destination: GeoCoordinates,
): Promise<DistanceTimeResult> => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY is not configured");
  }

  try {
    await geoapifyRateLimiter.acquire();
    const response = await axios.get(GEOAPIFY_ROUTING_URL, {
      params: {
        waypoints: `${origin.lat},${origin.lng}|${destination.lat},${destination.lng}`,
        mode: "drive",
        apiKey,
      },
      timeout: 12_000,
    });

    const features = response.data?.features;
    if (!features?.length) {
      throw new Error("No route found");
    }
    if (!features[0]?.properties) {
      throw new Error("Invalid route response");
    }

    return {
      distance: features[0].properties.distance / 1000, // meters → km
      time: features[0].properties.time, // seconds
    };
  } catch (err: unknown) {
    console.error("Geoapify routing error:", err);
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Unable to fetch distance and time",
      );
    }
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONCURRENCY-LIMITED PARALLEL MAPPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs `mapper` over every item in `items`, with at most `limit` calls in
 * flight simultaneously — a plain-JS "worker pool" that gives most of the
 * speed benefit of `Promise.all` without the risk of firing an unbounded
 * number of concurrent requests at a rate-limited third-party API.
 *
 * Results are returned in the SAME ORDER as `items`, regardless of which
 * order the individual calls actually resolve in.
 */
async function mapWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  const workerCount = Math.max(1, Math.min(limit, items.length));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC — attach sequential travel times to an ordered shipment list
// ─────────────────────────────────────────────────────────────────────────────

interface AttachTimingsOptions {
  /** Max simultaneous Geoapify requests. Defaults to DEFAULT_CONCURRENCY. */
  concurrency?: number;
  /** Buffer (seconds) added to every leg's raw travel time. Defaults to
   *  DEFAULT_SERVICE_BUFFER_SECONDS (10 minutes). */
  serviceBufferSeconds?: number;
}

interface AttachTimingsResult<T> {
  shipments: Array<T & SequentialTravelTiming>;
  legsCalculated: number;
  legsFailed: number;
  warnings: string[];
}

/**
 * attachSequentialTravelTimes
 *
 * Takes an ordered shipment list and returns the same list with each
 * shipment (except the first) decorated with its travel time FROM the
 * previous shipment. Every pairwise lookup runs concurrently (bounded by
 * `options.concurrency`), since no leg depends on any other leg's result.
 */
export async function attachSequentialTravelTimes<
  T extends HasDeliveryLocation,
>(
  shipments: T[],
  options?: AttachTimingsOptions,
): Promise<AttachTimingsResult<T>> {
  const concurrency = options?.concurrency ?? DEFAULT_CONCURRENCY;
  const serviceBufferSeconds =
    options?.serviceBufferSeconds ?? DEFAULT_SERVICE_BUFFER_SECONDS;

  if (shipments.length === 0) {
    return { shipments: [], legsCalculated: 0, legsFailed: 0, warnings: [] };
  }

  // Every index EXCEPT 0 needs a leg computed (index i's leg runs from
  // shipment[i-1] to shipment[i]).
  const legIndexes = shipments.slice(1).map((_, i) => i + 1);
  let isSecondShipment: boolean = true;
  const legResults = await mapWithConcurrencyLimit(
    legIndexes,
    concurrency,
    async (shipmentIndex) => {
      const previousStop = shipments[shipmentIndex - 1];
      const currentStop = shipments[shipmentIndex];

      try {
        const { distance, time } = await getDistanceTime(
          previousStop.deliverySelected,
          currentStop.deliverySelected,
        );
        const totalSeconds = Math.round(time + serviceBufferSeconds);
        let timing: SequentialTravelTiming;
        if (isSecondShipment) {
          timing = {
            isFirstStop: false,
            travelTimeFromPreviousSeconds: totalSeconds,
            travelTimeFromPreviousMinutes: Math.round(totalSeconds / 60),
            distanceFromPreviousKm: Math.round(distance * 10) / 10,
            travelTimeError: null,
          };
          isSecondShipment = false;
        } else {
          timing = {
            isFirstStop: false,
            travelTimeFromPreviousSeconds: totalSeconds,
            travelTimeFromPreviousMinutes: Math.round(totalSeconds / 60) + 10,
            distanceFromPreviousKm: Math.round(distance * 10) / 10,
            travelTimeError: null,
          };
        }
        // let timing: SequentialTravelTiming = {
        //   isFirstStop: false,
        //   travelTimeFromPreviousSeconds: totalSeconds,
        //   travelTimeFromPreviousMinutes: Math.round(totalSeconds / 60) + 10,
        //   distanceFromPreviousKm: Math.round(distance * 10) / 10,
        //   travelTimeError: null,
        // };
        return { shipmentIndex, timing };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const timing: SequentialTravelTiming = {
          isFirstStop: false,
          travelTimeFromPreviousSeconds: null,
          travelTimeFromPreviousMinutes: null,
          distanceFromPreviousKm: null,
          travelTimeError: message,
        };
        return { shipmentIndex, timing };
      }
    },
  );

  const legsFailed = legResults.filter(
    (r) => r.timing.travelTimeError !== null,
  ).length;
  const warnings = legResults
    .filter((r) => r.timing.travelTimeError !== null)
    .map(
      (r) =>
        `Leg into stop ${r.shipmentIndex} (from stop ${r.shipmentIndex - 1}): ${r.timing.travelTimeError}`,
    );

  const timingByShipmentIndex = new Map(
    legResults.map((r) => [r.shipmentIndex, r.timing]),
  );

  const firstStopTiming: SequentialTravelTiming = {
    isFirstStop: true,
    travelTimeFromPreviousSeconds: null,
    travelTimeFromPreviousMinutes: null,
    distanceFromPreviousKm: null,
    travelTimeError: null,
  };

  const decoratedShipments = shipments.map((shipment, index) => {
    const timing =
      index === 0 ? firstStopTiming : timingByShipmentIndex.get(index)!;
    return { ...shipment, ...timing };
  });

  return {
    shipments: decoratedShipments,
    legsCalculated: legIndexes.length - legsFailed,
    legsFailed,
    warnings,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the indexes of any shipments missing a usable `deliverySelected`. */
function findInvalidShipmentIndexes(shipments: unknown[]): number[] {
  const invalid: number[] = [];
  shipments.forEach((shipment, index) => {
    const loc = (shipment as { deliverySelected?: unknown })
      ?.deliverySelected as { lat?: unknown; lng?: unknown } | undefined;
    const validLat = typeof loc?.lat === "number" && Number.isFinite(loc.lat);
    const validLng = typeof loc?.lng === "number" && Number.isFinite(loc.lng);
    if (!loc || !validLat || !validLng) invalid.push(index);
  });
  return invalid;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPRESS HANDLER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /shipments/sequential-timing
 *
 * Body:
 *   {
 *     "shipments": [
 *       { "deliverySelected": { "lat": 52.38, "lng": 4.63 }, ...anything else... },
 *       ...
 *     ],
 *     "serviceBufferMinutes": 10,   // optional, defaults to 10
 *     "concurrency": 6              // optional, defaults to 6
 *   }
 *
 * Response (200):
 *   {
 *     "success": true,
 *     "shipments": [
 *       {
 *         ...original shipment fields, unchanged...,
 *         "isFirstStop": true,
 *         "travelTimeFromPreviousSeconds": null,
 *         "travelTimeFromPreviousMinutes": null,
 *         "distanceFromPreviousKm": null,
 *         "travelTimeError": null
 *       },
 *       {
 *         ...original shipment fields...,
 *         "isFirstStop": false,
 *         "travelTimeFromPreviousSeconds": 1332,   // includes the +10min buffer
 *         "travelTimeFromPreviousMinutes": 22,
 *         "distanceFromPreviousKm": 14.2,
 *         "travelTimeError": null
 *       }
 *     ],
 *     "meta": {
 *       "totalShipments": 5,
 *       "legsCalculated": 4,
 *       "legsFailed": 0,
 *       "serviceBufferMinutesPerStop": 10
 *     },
 *     "warnings": []
 *   }
 *
 * The frontend computes each stop's live ETA as:
 *   runningClock = now
 *   for each shipment in order:
 *     if not isFirstStop: runningClock += travelTimeFromPreviousSeconds
 *     display runningClock as this stop's ETA
 */
export async function calculateSequentialShipmentTimingsHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const shipments = req.body;
    if (!Array.isArray(shipments) || shipments.length === 0) {
      res.status(400).json({
        success: false,
        message: "Request body must include a non-empty `shipments` array.",
      });
      return;
    }

    const invalidIndexes = findInvalidShipmentIndexes(shipments);
    if (invalidIndexes.length > 0) {
      res.status(400).json({
        success: false,
        message:
          "Every shipment must include a valid deliverySelected { lat, lng } location.",
        invalidShipmentIndexes: invalidIndexes,
      });
      return;
    }

    // Fail fast with one clear error rather than N identical per-leg failures.
    if (!process.env.GEOAPIFY_API_KEY) {
      //   res.status(500).json({
      //     success: false,
      //     message: "GEOAPIFY_API_KEY is not configured on the server.",
      //   });
      return;
    }

    const requestedConcurrency = req.body?.concurrency;
    const concurrency =
      typeof requestedConcurrency === "number" && requestedConcurrency > 0
        ? requestedConcurrency
        : undefined;

    const requestedBufferMinutes = req.body?.serviceBufferMinutes;
    const serviceBufferSeconds =
      typeof requestedBufferMinutes === "number" && requestedBufferMinutes >= 0
        ? requestedBufferMinutes * 60
        : undefined;

    const result = await attachSequentialTravelTimes(
      shipments as HasDeliveryLocation[],
      {
        concurrency,
        serviceBufferSeconds,
      },
    );
    // await Route.updateOne(
    //   { routeNumber: req.body.route.routeNumber },
    //   { $set: { shipments: result.shipments } },
    // );

    // console.log(updatedRoute);
    res.status(200).json({
      success: true,
      shipments: result.shipments,
      meta: {
        totalShipments: shipments.length,
        legsCalculated: result.legsCalculated,
        legsFailed: result.legsFailed,
        serviceBufferMinutesPerStop:
          (serviceBufferSeconds ?? DEFAULT_SERVICE_BUFFER_SECONDS) / 60,
      },
      warnings: result.warnings,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message:
        "Unexpected server error while calculating shipment travel times.",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. WIRING (for reference — add to your Express router file, not here)
// ─────────────────────────────────────────────────────────────────────────────
//
//   import { calculateSequentialShipmentTimingsHandler }
//     from "./sequentialTravelTiming.service";
//
//   router.post(
//     "/shipments/sequential-timing",
//     authMiddleware,
//     calculateSequentialShipmentTimingsHandler,
//   );
//
// Required environment variable:
//   GEOAPIFY_API_KEY=...
// ─────────────────────────────────────────────────────────────────────────────
