import { Position, ShipmentDocument } from "./types.js";

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/** Pure Haversine great-circle distance in kilometers. No caching — use
 * createDistanceCache() below for a memoized version. */
export const calculateDistance = (a: Position, b: Position): number => {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);

  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return EARTH_RADIUS_KM * c;
};

export const DEPOT_LOCATION_KEY = "DEPOT";

/** Stable cache key for a location: the warehouse always keys to the same
 * value (it's one physical point, however many times it's visited in a
 * route); every other location keys off its shipment id. */
export const locationKey = (
  shipment: Pick<ShipmentDocument, "_id" | "isWarehouse">,
): string =>
  shipment.isWarehouse ? DEPOT_LOCATION_KEY : shipment._id.toString();

export interface KeyedPosition extends Position {
  key: string;
}

const makeCacheKey = (keyA: string, keyB: string): string =>
  keyA < keyB ? `${keyA}::${keyB}` : `${keyB}::${keyA}`;

/**
 * Creates a memoized distance calculator backed by a `Map<string, number>`.
 * Scoped to a single optimizer run (create a fresh one per request) rather
 * than a module-level singleton, so the cache can't grow unbounded across
 * the life of the process as shipments come and go.
 */
export const createDistanceCache = () => {
  const cache = new Map<string, number>();

  const cachedCalculateDistance = (
    a: KeyedPosition,
    b: KeyedPosition,
  ): number => {
    if (a.key === b.key) return 0;

    const cacheKey = makeCacheKey(a.key, b.key);
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return cached;

    const distance = calculateDistance(a, b);
    cache.set(cacheKey, distance);
    return distance;
  };

  return { calculateDistance: cachedCalculateDistance, cache };
};

export type DistanceCalculator = ReturnType<
  typeof createDistanceCache
>["calculateDistance"];
