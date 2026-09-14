import { Request, Response } from "express";
import mongoose, { Schema, Document, Types, Model } from "mongoose";
import axios from "axios";
// import { calculateSequentialShipmentTimingsHandler } from "./sequentialtraveltiming.service.js";

// ─────────────────────────────────────────────────────────────────────────────
// 1. TYPES & INTERFACES
// ─────────────────────────────────────────────────────────────────────────────
let forceInjectingShipmentCount = 0;
interface PositionLatLng {
  lat: number;
  lng: number;
}

function sortDeliveriesByNearest(
  deliveries: IShipment[],
  currentLocation: PositionLatLng,
): IShipment[] {
  if (deliveries.length <= 1) {
    return [...deliveries];
  }

  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  const getDistance = (from: PositionLatLng, to: PositionLatLng): number => {
    const R = 6371;

    const lat1 = toRadians(from.lat);
    const lat2 = toRadians(to.lat);

    const deltaLat = toRadians(to.lat - from.lat);
    const deltaLng = toRadians(to.lng - from.lng);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const remaining = [...deliveries];
  const sorted: IShipment[] = [];

  let current: PositionLatLng = {
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  };

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const delivery = remaining[i];

      const distance = getDistance(current, delivery.deliverySelected);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    const [nearestDelivery] = remaining.splice(nearestIndex, 1);

    sorted.push(nearestDelivery);

    // Last selected delivery becomes the new current location
    current = {
      lat: nearestDelivery.deliverySelected.lat,
      lng: nearestDelivery.deliverySelected.lng,
    };
  }

  return sorted;
}
export interface IShipment extends Document {
  _id: Types.ObjectId;
  isUrgent: boolean;
  OwnerRef: Types.ObjectId;
  clientName: string;
  clientPhoneNumber: number;
  pickupAddress: string;
  deliveryAddress: string;
  deliverySelected: PositionLatLng;
  boxQuantity: number;
  driverAllocated: boolean;
  deliveryShift: string;
  routeNumber?: string;
  shipmentType: "delivery" | "collection";
  status: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoute extends Document {
  _id: Types.ObjectId;
  OwnerRef: Types.ObjectId;
  vehicleCapacity: number;
  routeNumber: string;
  deliveryShift: string;
  shipmentType: "delivery" | "collection" | "mixed";
  status: string;
  initialBoxCount: number;
  totalBoxes: number;
  shipments: IShipment[];
}

interface CreateRouteBody {
  vehicleCapacity: number;
  routeType: string;
  deliveryShift: string;
  routeNumber?: string;
}

// ── Google Distance Matrix API shapes ─────────────────────────────────────────

interface DistanceMatrixElement {
  status: string;
  distance: { value: number; text: string };
  duration: { value: number; text: string };
}

interface DistanceMatrixRow {
  elements: DistanceMatrixElement[];
}

interface DistanceMatrixResponse {
  status: string;
  origin_addresses: string[];
  destination_addresses: string[];
  rows: DistanceMatrixRow[];
}

// ── Internal algorithm node ───────────────────────────────────────────────────

type StopKind = "delivery" | "collection";

interface RouteNode {
  matrixIndex: number;
  shipment: IShipment;
  kind: StopKind;
  coords: PositionLatLng;
  boxes: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MONGOOSE SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

const PositionSchema = new Schema<PositionLatLng>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false },
);

const ShipmentSchema = new Schema<IShipment>(
  {
    OwnerRef: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    clientName: { type: String, required: true, trim: true },
    clientPhoneNumber: { type: Number, required: true },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    deliverySelected: { type: PositionSchema, required: true },
    boxQuantity: { type: Number, required: true, min: 1 },
    driverAllocated: { type: Boolean, default: false },
    deliveryShift: { type: String, required: true },
    shipmentType: {
      type: String,
      enum: ["delivery", "collection"],
      required: true,
    },
    status: { type: String, default: "pending" },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

const RouteSchema = new Schema<IRoute>(
  {
    OwnerRef: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    vehicleCapacity: { type: Number, required: true, min: 1 },
    deliveryShift: { type: String, required: true },
    routeNumber: { type: String, required: true },
    shipmentType: { type: String, default: "mixed" },
    status: { type: String, default: "pending" },
    totalBoxes: { type: Number, required: true, min: 0 },
    shipments: { type: [ShipmentSchema], default: [] },
  },
  { timestamps: true },
);

const Shipment: Model<IShipment> =
  (mongoose.models.Shipment as Model<IShipment>) ??
  mongoose.model<IShipment>("Shipment", ShipmentSchema);

const Route: Model<IRoute> =
  (mongoose.models.Route as Model<IRoute>) ??
  mongoose.model<IRoute>("Route", RouteSchema);

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DISTANCE_MATRIX_URL =
  "https://maps.googleapis.com/maps/api/distancematrix/json";

/**
 * Google Distance Matrix API hard limits (standard / pay-as-you-go tier):
 *
 *   Max origins  per request : 25
 *   Max destinations per req : 25
 *   Max ELEMENTS per request : origins × destinations ≤ 100
 *
 * To stay safely within the 100-element ceiling we use a 10×10 chunk:
 *   10 origins × 10 destinations = 100 elements  ← exactly at the limit
 *
 * Using 9×9 = 81 gives a small safety margin in case Google counts the depot
 * row/column differently.  Adjust CHUNK_ORIGINS / CHUNK_DESTS below if you
 * are on the "Maps Platform Premium" plan where the limit is 625 elements.
 */
const CHUNK_ORIGINS = 9; // origins per API call
const CHUNK_DESTS = 9; // destinations per API call
// → max elements per call = 9 × 9 = 81  (well under the 100 hard cap)

const DEPOT: PositionLatLng = {
  lat: parseFloat(process.env.DEPOT_LAT ?? "52.4002"),
  lng: parseFloat(process.env.DEPOT_LNG ?? "4.6417"),
};

// Milliseconds to wait between Distance Matrix calls to avoid rate-limiting
const RATE_LIMIT_DELAY_MS = 120;

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISTANCE MATRIX — element-aware chunked fetcher
// ─────────────────────────────────────────────────────────────────────────────

/** Tiny helper — wait N ms between calls to respect QPS limits */
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * buildDistanceMatrix
 *
 * Fetches a full N×N travel-time matrix (in seconds) for the given geo-points,
 * chunking calls so that origins × destinations ≤ 100 (the API hard cap).
 *
 * Points layout expected by callers:
 *   index 0       → depot (warehouse)
 *   index 1..D    → delivery stop coordinates  (unique per shipment)
 *   index D+1..   → collection stop coordinates (unique per shipment)
 *
 * Each point is a DISTINCT physical location — the depot coords come from
 * DEPOT_LAT/DEPOT_LNG env vars, and every shipment's `deliverySelected`
 * is its individual client/collection address.
 */

function sortFarthestDeliveries(
  deliveries: IShipment[],
  currentLocation: PositionLatLng,
) {
  if (!Array.isArray(deliveries)) {
    throw new TypeError("deliveries must be an array");
  }

  if (
    !currentLocation ||
    !Number.isFinite(currentLocation.lat) ||
    !Number.isFinite(currentLocation.lng)
  ) {
    throw new TypeError("Invalid currentLocation");
  }

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const distance = (pointA: PositionLatLng, pointB: PositionLatLng) => {
    const R = 6371; // Earth radius in kilometers

    const lat1 = toRadians(pointA.lat);
    const lat2 = toRadians(pointB.lat);

    const deltaLat = toRadians(pointB.lat - pointA.lat);
    const deltaLng = toRadians(pointB.lng - pointA.lng);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return deliveries
    .map((delivery, index) => {
      const location = delivery.deliverySelected;

      if (
        !location ||
        !Number.isFinite(location.lat) ||
        !Number.isFinite(location.lng)
      ) {
        throw new Error(`Invalid delivery coordinates at index ${index}`);
      }

      return {
        delivery,
        distance: distance(currentLocation, location),
        index,
      };
    })
    .sort((a, b) => {
      const difference = b.distance - a.distance;

      // Preserve original order if distances are effectively identical
      return Math.abs(difference) < Number.EPSILON
        ? a.index - b.index
        : difference;
    })
    .map(({ delivery }) => delivery);
}

function sortNearestDeliveries(
  deliveries: IShipment[],
  currentLocation: PositionLatLng,
) {
  if (!Array.isArray(deliveries)) {
    throw new TypeError("deliveries must be an array");
  }

  if (
    !currentLocation ||
    !Number.isFinite(currentLocation.lat) ||
    !Number.isFinite(currentLocation.lng)
  ) {
    throw new TypeError("Invalid currentLocation");
  }

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const distance = (pointA: PositionLatLng, pointB: PositionLatLng) => {
    const R = 6371; // Earth radius in kilometers

    const lat1 = toRadians(pointA.lat);
    const lat2 = toRadians(pointB.lat);

    const deltaLat = toRadians(pointB.lat - pointA.lat);
    const deltaLng = toRadians(pointB.lng - pointA.lng);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return deliveries
    .map((delivery, index) => {
      const location = delivery.deliverySelected;

      if (
        !location ||
        !Number.isFinite(location.lat) ||
        !Number.isFinite(location.lng)
      ) {
        throw new Error(`Invalid delivery coordinates at index ${index}`);
      }

      return {
        delivery,
        distance: distance(currentLocation, location),
        index,
      };
    })
    .sort((a, b) => {
      const difference = a.distance - b.distance;

      // Keep original order if distances are effectively identical
      return Math.abs(difference) < Number.EPSILON
        ? a.index - b.index
        : difference;
    })
    .map(({ delivery }) => delivery);
}

interface PositionLatLng {
  lat: number;
  lng: number;
}

interface GeoapifyRouteMatrixResponse {
  sources: {
    original_location: [number, number];
    location: [number, number];
  }[];

  targets: {
    original_location: [number, number];
    location: [number, number];
  }[];

  sources_to_targets: {
    distance: number;
    time: number;
    source_index: number;
    target_index: number;
  }[][];

  units: string;
  distance_units: string;
  mode: string;
}

// async function buildDistanceMatrix(
//   points: PositionLatLng[],
// ): Promise<number[][]> {
//   const n = points.length;
//   // console.log(points);
//   if (n === 0) {
//     return [];
//   }

//   const matrix: number[][] = Array.from({ length: n }, () =>
//     new Array<number>(n).fill(Infinity),
//   );

//   const locations = points.map(({ lat, lng }) => ({
//     location: [lng, lat] as [number, number],
//   }));

//   const { data } = await axios.post<GeoapifyRouteMatrixResponse>(
//     "https://api.geoapify.com/v1/routematrix",
//     {
//       mode: "drive",
//       sources: locations,
//       targets: locations,
//     },
//     {
//       params: {
//         apiKey: process.env.GEOAPIFY_API_KEY,
//       },
//       headers: {
//         "Content-Type": "application/json",
//       },
//       timeout: 15_000,
//     },
//   );

//   if (!data?.sources_to_targets) {
//     throw new Error("Geoapify Route Matrix returned an invalid response.");
//   }

//   for (const routes of data.sources_to_targets) {
//     for (const route of routes) {
//       const { source_index, target_index, time } = route;

//       if (
//         Number.isInteger(source_index) &&
//         Number.isInteger(target_index) &&
//         Number.isFinite(time)
//       ) {
//         matrix[source_index][target_index] = time;
//       }
//     }
//   }

//   return matrix;
// }

async function buildDistanceMatrix(
  points: PositionLatLng[],
): Promise<number[][]> {
  const n = points.length;

  // Initialise full matrix with Infinity (unreachable sentinel)
  const matrix: number[][] = Array.from({ length: n }, () =>
    new Array<number>(n).fill(Infinity),
  );

  const fmt = (p: PositionLatLng) => `${p.lat},${p.lng}`;

  // Iterate origin chunks
  for (let ri = 0; ri < n; ri += CHUNK_ORIGINS) {
    const rEnd = Math.min(ri + CHUNK_ORIGINS, n);
    const origins = points.slice(ri, rEnd).map(fmt);

    // Iterate destination chunks
    for (let ci = 0; ci < n; ci += CHUNK_DESTS) {
      const cEnd = Math.min(ci + CHUNK_DESTS, n);
      const destinations = points.slice(ci, cEnd).map(fmt);

      // Actual elements count for this chunk
      const elementCount = (rEnd - ri) * (cEnd - ci);

      // Double-check — should never exceed 100 with our chunk sizes
      if (elementCount > 100) {
        throw new Error(
          `Chunk size calculation error: ${elementCount} elements in one call. ` +
            `Reduce CHUNK_ORIGINS or CHUNK_DESTS.`,
        );
      }

      const { data } = await axios.get<DistanceMatrixResponse>(
        DISTANCE_MATRIX_URL,
        {
          params: {
            origins: origins.join("|"),
            destinations: destinations.join("|"),
            mode: "driving",
            key: process.env.GOOGLE_MAPS_API,
          },
          timeout: 15_000,
        },
      );

      // Surface specific Google API errors with actionable messages
      if (data.status !== "OK") {
        const hints: Record<string, string> = {
          MAX_ELEMENTS_EXCEEDED:
            "Too many elements per request. Reduce CHUNK_ORIGINS/CHUNK_DESTS.",
          REQUEST_DENIED:
            "API key is invalid or the Distance Matrix API is not enabled.",
          OVER_DAILY_LIMIT: "API key has exceeded its daily quota.",
          OVER_QUERY_LIMIT:
            "QPS limit hit. Increase RATE_LIMIT_DELAY_MS and retry.",
          INVALID_REQUEST:
            "Malformed request — check that all lat/lng values are valid numbers.",
        };

        const hint = hints[data.status] ?? "Check the Google Maps API console.";
        throw new Error(`Distance Matrix API error [${data.status}]: ${hint}`);
      }

      // Write chunk results into the global matrix
      data.rows.forEach((row, r) => {
        row.elements.forEach((el, c) => {
          if (el.status === "OK") {
            matrix[ri + r][ci + c] = el.duration.value; // seconds
          }
          // ZERO_RESULTS / NOT_FOUND → stays Infinity (unreachable)
        });
      });

      // Respect QPS between successive chunk calls
      if (ci + CHUNK_DESTS < n || ri + CHUNK_ORIGINS < n) {
        await sleep(RATE_LIMIT_DELAY_MS);
      }
    }
  }

  return matrix;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ROUTING ALGORITHM
// ─────────────────────────────────────────────────────────────────────────────

/** Greedy delivery packing — largest-first to maximise vehicle utilisation */
function selectDeliveries(
  deliveries: IShipment[],
  vehicleCapacity: number,
  urgentDeliveryLoaded = 0,
  forceType?: string,
): IShipment[] {
  if (!Array.isArray(deliveries) || deliveries.length === 0) {
    return [];
  }
  const sorted = [...deliveries].sort((a, b) => b.boxQuantity - a.boxQuantity);

  let loaded = forceType === "delivery" ? urgentDeliveryLoaded : 0;

  if (loaded > vehicleCapacity) {
    throw new Error(
      `Urgent delivery load (${loaded}) exceeds vehicle capacity (${vehicleCapacity})`,
    );
  }

  const selected: IShipment[] = [];

  for (const shipment of sorted) {
    const boxes = shipment.boxQuantity;

    if (!Number.isFinite(boxes) || boxes <= 0) {
      continue;
    }

    if (loaded + boxes <= vehicleCapacity) {
      selected.push(shipment);
      loaded += boxes;

      // Vehicle is completely full.
      if (loaded === vehicleCapacity) {
        break;
      }
    }
  }

  return selected;
}
/** Nearest-neighbour TSP — greedy stop ordering from the depot */
function nearestNeighbourOrder(
  nodes: RouteNode[],
  matrix: number[][],
  depotIdx: number,
): RouteNode[] {
  const unvisited = new Set(nodes.map((n) => n.matrixIndex));
  const ordered: RouteNode[] = [];
  let current = depotIdx;

  while (unvisited.size > 0) {
    let nearest: RouteNode | null = null;
    let bestTime = Infinity;

    for (const node of nodes) {
      if (!unvisited.has(node.matrixIndex)) continue;
      const t = matrix[current][node.matrixIndex];
      if (t < bestTime) {
        bestTime = t;
        nearest = node;
      }
    }

    if (!nearest) break;
    ordered.push(nearest);
    unvisited.delete(nearest.matrixIndex);
    current = nearest.matrixIndex;
  }

  return ordered;
}

/**
 * insertCollections — dynamic capacity-aware interleaving
 *
 * Walks the ordered delivery sequence stop-by-stop, simulates the live
 * box count after each drop, then greedily inserts the nearest feasible
 * collection stop (where current load + collection.boxes ≤ vehicleCapacity).
 *
 * This is the core of the mixed-route logic:
 *   delivery drop  → freed space becomes available for collections
 *   collection     → consumes some of that freed space
 */
function insertCollections(
  deliveryRoute: RouteNode[],
  collections: RouteNode[],
  matrix: number[][],
  vehicleCapacity: number,
  initialBoxes: number,
): RouteNode[] {
  const result = [...deliveryRoute];
  const pendingColl = new Set(collections.map((c) => c.matrixIndex));
  let boxesOnBoard = initialBoxes;

  // We rebuild the sequence by simulating stop-by-stop
  const mixed: RouteNode[] = [];
  let fromIdx = 0; // depot matrix index

  for (const deliveryNode of deliveryRoute) {
    mixed.push(deliveryNode);
    boxesOnBoard -= deliveryNode.boxes; // boxes freed after drop

    // After this delivery drop, greedily insert feasible collections
    let inserted = true;
    let fromIndex = deliveryNode.matrixIndex;

    while (inserted && pendingColl.size > 0) {
      inserted = false;
      let bestColl: RouteNode | null = null;
      let bestTime = Infinity;

      for (const coll of collections) {
        if (!pendingColl.has(coll.matrixIndex)) continue;
        if (boxesOnBoard + coll.boxes > vehicleCapacity) continue; // no room

        const t = matrix[fromIndex][coll.matrixIndex];
        if (t < bestTime) {
          bestTime = t;
          bestColl = coll;
        }
      }

      if (bestColl) {
        mixed.push(bestColl);
        boxesOnBoard += bestColl.boxes;
        pendingColl.delete(bestColl.matrixIndex);
        fromIndex = bestColl.matrixIndex;
        inserted = true;
      }
    }
  }

  // Append any remaining collections that fit after all deliveries are done
  for (const coll of collections) {
    if (!pendingColl.has(coll.matrixIndex)) continue;
    if (boxesOnBoard + coll.boxes <= vehicleCapacity) {
      mixed.push(coll);
      boxesOnBoard += coll.boxes;
      pendingColl.delete(coll.matrixIndex);
    }
  }

  return mixed;
}

/** 2-opt improvement — reduces total travel time by reversing sub-segments */
function twoOpt(
  route: RouteNode[],
  matrix: number[][],
  depotIdx: number,
): RouteNode[] {
  let improved = true;

  while (improved) {
    improved = false;
    for (let i = 0; i < route.length - 1; i++) {
      for (let j = i + 2; j < route.length; j++) {
        const prevI = i === 0 ? depotIdx : route[i - 1].matrixIndex;
        const nodeI = route[i].matrixIndex;
        const nodeJ = route[j].matrixIndex;
        const nextJ =
          j === route.length - 1 ? depotIdx : route[j + 1].matrixIndex;

        if (
          matrix[prevI][nodeJ] + matrix[nodeI][nextJ] <
          matrix[prevI][nodeI] + matrix[nodeJ][nextJ]
        ) {
          route.splice(i, j - i + 1, ...route.slice(i, j + 1).reverse());
          improved = true;
        }
      }
    }
  }

  return route;
}

/** Final capacity simulation — removes stops that violate the model after 2-opt */
function validateCapacitySequence(
  route: RouteNode[],
  vehicleCapacity: number,
  initialBoxes: number,
): { validRoute: RouteNode[]; finalBoxes: number } {
  const validRoute: RouteNode[] = [];
  let current = initialBoxes;

  for (const node of route) {
    if (node.kind === "delivery") {
      if (current - node.boxes < 0) continue; // guard (shouldn't happen)
      validRoute.push(node);
      current -= node.boxes;
    } else {
      if (current + node.boxes > vehicleCapacity) continue; // no room
      validRoute.push(node);
      current += node.boxes;
    }
  }

  return { validRoute, finalBoxes: current };
}

function getNearestLocation(
  origin: PositionLatLng,
  location1: PositionLatLng,
  location2: PositionLatLng,
) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const distanceInKm = (pointA: PositionLatLng, pointB: PositionLatLng) => {
    const R = 6371; // Earth's radius in kilometers

    const lat1 = toRadians(pointA.lat);
    const lat2 = toRadians(pointB.lat);

    const deltaLat = toRadians(pointB.lat - pointA.lat);
    const deltaLng = toRadians(pointB.lng - pointA.lng);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const distance1 = distanceInKm(origin, location1);
  const distance2 = distanceInKm(origin, location2);

  if (distance1 <= distance2) {
    return {
      nearest: location1,
      distanceKm: distance1,
      distanceMeters: distance1 * 1000,
    };
  }

  return {
    nearest: location2,
    distanceKm: distance2,
    distanceMeters: distance2 * 1000,
  };
}

export async function handleAddExistingShipmentsForNumberBasedRoute(
  req: Request & { userId?: string },
  res: Response,
) {
  const ownerId: Types.ObjectId = (req as any).userId;
  let { vehicleCapacity, routeType, routeNumber } = req.body as CreateRouteBody;
  let forcedExistingCollections: IShipment[] = [];
  let continueMapping: boolean = true;

  let existingCollections: IShipment[] =
    req.body.data.data.summary.skippedCollections;
  let existingCapacity: number =
    vehicleCapacity - req.body.data.data.summary.boxesOnBoardAtReturn;

  if (existingCollections.length > 0 && continueMapping) {
    if (continueMapping) {
      existingCollections.map((s: IShipment) => {
        const nearestLocationFromLatestDelivery = getNearestLocation(
          req.body.data.data.route.shipments[
            req.body.data.data.route.shipments.length - 1
          ].deliverySelected,
          DEPOT,
          s.deliverySelected,
        );
        if (
          nearestLocationFromLatestDelivery.nearest.lat ==
            s.deliverySelected.lat &&
          nearestLocationFromLatestDelivery.nearest.lng ==
            s.deliverySelected.lng
        ) {
          if (existingCapacity - s.boxQuantity >= 0) {
            existingCapacity -= s.boxQuantity;
            forcedExistingCollections.push(s);
          } else {
            continueMapping = false;
          }
        } else {
          continueMapping = false;
        }
      });
    }
  }
  if (forcedExistingCollections.length > 0) {
    forcedExistingCollections.map((s: IShipment) => {
      s.status = "transit";
    });
    const newRoute = await Route.findByIdAndUpdate(
      req.body.data.data.route._id,
      {
        $set: {
          shipments: [
            ...req.body.data.data.route.shipments,
            ...forcedExistingCollections,
          ],
        },
      },
      { returnDocument: "after" },
    );
    req.body.data.data.route.shipments = [
      ...req.body.data.data.route.shipments,
      ...forcedExistingCollections,
    ];
    req.body.data.data.summary.skippedCollections =
      req.body.data.data.summary.skippedCollections.filter((s: IShipment) => {
        return !forcedExistingCollections.some((f) => f._id.equals(s._id));
      });
    await Shipment.updateMany(
      { _id: { $in: forcedExistingCollections.map((s) => s._id) } },
      { $set: { status: "transit" } },
    );

    let rawDeliveries = req.body.data.data.summary.skippedDeliveries;
    let rawCollections = req.body.data.data.summary.skippedCollections;
    if (rawCollections?.length == 0 && rawDeliveries?.length == 0) {
      return res.status(200).json({
        success: true,
        message: `Mixed route created:  delivery stops collection stops.`,
        data: {
          route: newRoute!,
        },
      });
    }
    // ── 7b. Select deliveries to load at departure ────────────────────────────
    let forcedCollections;
    let urgentCollectionLoaded = vehicleCapacity - existingCapacity;
    let urgentDeliveryLoaded = 0;
    let forceType = "";
    const forcedDeliveries = rawDeliveries.filter((s: IShipment) => s.isUrgent);
    if (!forcedDeliveries.length) {
      forceType = "collection";
      forcedCollections = rawCollections.filter((s: IShipment) => s.isUrgent);
    } else {
      forceType = "delivery";
      forcedDeliveries.forEach((d: IShipment) => {
        urgentDeliveryLoaded += d.boxQuantity;
      });
    }

    rawDeliveries = rawDeliveries.filter((s: IShipment) => !s.isUrgent);
    rawCollections = rawCollections.filter((s: IShipment) => !s.isUrgent);
    const selectedDeliveries = selectDeliveries(
      rawDeliveries,
      vehicleCapacity,
      forceType == "delivery" ? urgentDeliveryLoaded : urgentCollectionLoaded,
      forceType,
    );
    const initialBoxesLoaded = [
      ...selectedDeliveries,
      ...forcedDeliveries,
    ].reduce((s, d) => s + d.boxQuantity, 0);

    // ── 7c. Build geo-point list for the distance matrix ─────────────────────
    //
    // IMPORTANT — every entry is a DISTINCT physical location:
    //
    //   index 0       → DEPOT (DEPOT_LAT / DEPOT_LNG env vars)
    //   index 1..D    → each delivery's deliverySelected  (client's address)
    //   index D+1..   → each collection's deliverySelected (collection point)
    //
    // deliverySelected is the STOP coordinate, not the warehouse —
    // this ensures the distance matrix has different origin/destination
    // pairs for every cell in the matrix.

    const allPoints: PositionLatLng[] = [
      DEPOT,
      ...rawDeliveries.map((s: IShipment) => s.deliverySelected),
      ...rawCollections.map((s: IShipment) => s.deliverySelected),
    ];

    const deliveryNodes: RouteNode[] = selectedDeliveries.map(
      (s: IShipment, i: number) => ({
        matrixIndex: i + 1,
        shipment: s,
        kind: "delivery" as StopKind,
        coords: s.deliverySelected,
        boxes: s.boxQuantity,
      }),
    );

    const collectionNodes: RouteNode[] = rawCollections.map(
      (s: IShipment, i: number) => ({
        matrixIndex: selectedDeliveries.length + 1 + i,
        shipment: s,
        kind: "collection" as StopKind,
        coords: s.deliverySelected,
        boxes: s.boxQuantity,
      }),
    );

    // ── 7d. Fetch distance matrix (element-aware chunking) ────────────────────
    //
    // Each call sends at most CHUNK_ORIGINS × CHUNK_DESTS = 81 elements,
    // well within Google's 100-element hard cap.

    let matrix: number[][];

    try {
      matrix = await buildDistanceMatrix(allPoints);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return res.status(502).json({
        success: false,
        message: "Google Maps Distance Matrix API call failed.",
        detail: msg,
      });
    }

    // ── 7e. TSP — nearest-neighbour ordering for deliveries ───────────────────

    const orderedDeliveries = nearestNeighbourOrder(deliveryNodes, matrix, 0);

    // ── 7f. Interleave collections where capacity allows ─────────────────────

    const mixedRoute = insertCollections(
      orderedDeliveries,
      collectionNodes,
      matrix,
      vehicleCapacity,
      initialBoxesLoaded,
    );

    // ── 7g. 2-opt refinement over the full mixed sequence ─────────────────────

    const refinedRoute = twoOpt([...mixedRoute], matrix, 0);

    // ── 7h. Re-validate capacity after 2-opt reorders ─────────────────────────

    const { validRoute, finalBoxes } = validateCapacitySequence(
      refinedRoute,
      vehicleCapacity,
      initialBoxesLoaded,
    );

    // ── 7i. Compute totals ────────────────────────────────────────────────────

    let deliveryCount = 0;
    let collectionCount = 0;
    let forcedShipments: IShipment[];
    deliveryCount = validRoute.filter((n) => n.kind === "delivery").length;
    collectionCount = validRoute.filter((n) => n.kind === "collection").length;

    if (forceType == "delivery") {
      forcedShipments = forcedDeliveries || [];
      deliveryCount += forcedShipments.length;
    } else {
      forcedShipments = forcedCollections || [];
      collectionCount += forcedShipments.length;
    }

    if (!validRoute.length && forcedShipments.length == 0) {
      return res.status(422).json({
        success: false,
        message:
          "No stops fit within vehicleCapacity after optimization. " +
          "Try a higher vehicleCapacity or smaller boxQuantity values.",
        debug: {
          vehicleCapacity,
          smallestDelivery: rawDeliveries.length
            ? Math.min(...rawDeliveries.map((s: IShipment) => s.boxQuantity))
            : null,
          smallestCollection: rawCollections.length
            ? Math.min(...rawCollections.map((s: IShipment) => s.boxQuantity))
            : null,
        },
      });
    }

    const orderedShipments = [
      ...forcedShipments,
      ...validRoute.map((n) => n.shipment),
    ];
    orderedShipments.map((s) => (s.status = "transit"));

    // ── 7j. Persist — atomic transaction ─────────────────────────────────────
    let initialBoxCount: number = 0;
    let continueMappingCollection = true;
    orderedShipments.forEach((s) => {
      if (s.shipmentType == "delivery" && continueMappingCollection) {
        continueMappingCollection = false;
      }
      if (s.shipmentType == "collection" && continueMappingCollection) {
        initialBoxCount += s.boxQuantity;
      }
    });
    let savedRoute;
    try {
      savedRoute = await Route.findOneAndUpdate(
        {
          _id: req.body.data.data.route._id,
        },
        {
          shipments: [
            ...req.body.data.data.route.shipments,
            ...orderedShipments,
          ],
        },
        { returnDocument: "after" },
      );

      if (!savedRoute) {
        throw new Error("Route not found during update");
      }

      await Shipment.updateMany(
        { _id: { $in: orderedShipments.map((s) => s._id) } },
        { $set: { status: "transit" } },
      );
    } catch (err) {
      console.log("Error creating route");
      throw err;
    }

    // ── 7k. Build stop manifest ───────────────────────────────────────────────

    let simBoxes = initialBoxesLoaded;
    const stopManifest = validRoute.map((node, idx) => {
      const before = simBoxes;
      simBoxes =
        node.kind === "delivery"
          ? simBoxes - node.boxes
          : simBoxes + node.boxes;
      return {
        stopNumber: idx + 1,
        action: node.kind === "delivery" ? "DROP" : "PICK",
        client: node.shipment.clientName,
        address: node.shipment.deliveryAddress,
        coords: node.coords,
        boxes: node.boxes,
        boxesBefore: before,
        boxesAfter: simBoxes,
        capacityUsedPct: Math.round((simBoxes / vehicleCapacity) * 100),
        shipmentType: node.kind,
        shipmentId: node.shipment._id,
      };
    });

    const skippedDeliveriesCount = rawDeliveries.length - deliveryCount;
    const skippedCollectionsCount = rawCollections.length - collectionCount;

    // ── 7l. Respond ───────────────────────────────────────────────────────────
    if (
      routeType == "number" &&
      (skippedCollectionsCount > 0 || skippedDeliveriesCount > 0)
    ) {
      let skippedDeliveries: IShipment[] = await Shipment.find({
        OwnerRef: req.userId,
        status: "pending",
        routeNumber: routeNumber,
        shipmentType: "delivery",
      });

      let skippedCollections: IShipment[] = await Shipment.find({
        OwnerRef: req.userId,
        status: "pending",
        routeNumber: routeNumber,
        shipmentType: "collection",
      });

      req.body.data = {
        data: {
          route: savedRoute!,
          summary: {
            totalStops: validRoute.length,
            deliveryStops: deliveryCount,
            collectionStops: collectionCount,
            vehicleCapacity,
            boxesLoadedAtDepot: initialBoxesLoaded,
            boxesOnBoardAtReturn: finalBoxes,
            deliveryUtilizationPct: Math.round(
              (initialBoxesLoaded / vehicleCapacity) * 100,
            ),
            skippedDeliveries: skippedDeliveries,
            skippedCollections: skippedCollections,
            skippedDeliveriesCount: skippedDeliveriesCount,
            skippedCollectionsCount: skippedCollectionsCount,
            depot: DEPOT,
            matrixSize: `${allPoints.length} × ${allPoints.length} = ${allPoints.length ** 2} elements`,
            apiCallsRequired:
              Math.ceil(allPoints.length / CHUNK_ORIGINS) *
              Math.ceil(allPoints.length / CHUNK_DESTS),
          },
          stopManifest,
        },
      };
      if (forceInjectingShipmentCount > 4) {
        // req.body.route = savedRoute.toObject();
        // const times = await calculateSequentialShipmentTimingsHandler(req, res);
        return res.status(200).json({
          success: true,
          message: `Mixed route created: ${deliveryCount} delivery stops + ${collectionCount} collection stops.`,
          data: {
            route: savedRoute!,
            summary: {
              // times,
              totalStops: validRoute.length,
              deliveryStops: deliveryCount,
              collectionStops: collectionCount,
              vehicleCapacity,
              boxesLoadedAtDepot: initialBoxesLoaded,
              boxesOnBoardAtReturn: finalBoxes,
              deliveryUtilizationPct: Math.round(
                (initialBoxesLoaded / vehicleCapacity) * 100,
              ),
              depot: DEPOT,
              matrixSize: `${allPoints.length} × ${allPoints.length} = ${allPoints.length ** 2} elements`,
              apiCallsRequired:
                Math.ceil(allPoints.length / CHUNK_ORIGINS) *
                Math.ceil(allPoints.length / CHUNK_DESTS),
            },
            stopManifest,
          },
        });
      }
      forceInjectingShipmentCount = forceInjectingShipmentCount + 1;
      handleAddExistingShipmentsForNumberBasedRoute(req, res);
    } else {
      // req.body.route = savedRoute.toObject();
      // const times = await calculateSequentialShipmentTimingsHandler(req, res);
      return res.status(200).json({
        success: true,
        message: `Mixed route created: ${deliveryCount} delivery stops + ${collectionCount} collection stops.`,
        data: {
          route: savedRoute!,
          summary: {
            // times,
            totalStops: validRoute.length,
            deliveryStops: deliveryCount,
            collectionStops: collectionCount,
            vehicleCapacity,
            boxesLoadedAtDepot: initialBoxesLoaded,
            boxesOnBoardAtReturn: finalBoxes,
            deliveryUtilizationPct: Math.round(
              (initialBoxesLoaded / vehicleCapacity) * 100,
            ),
            depot: DEPOT,
            matrixSize: `${allPoints.length} × ${allPoints.length} = ${allPoints.length ** 2} elements`,
            apiCallsRequired:
              Math.ceil(allPoints.length / CHUNK_ORIGINS) *
              Math.ceil(allPoints.length / CHUNK_DESTS),
          },
          stopManifest,
        },
      });
    }
  } else {
    const wareHouseCollection = await Shipment.create({
      OwnerRef: ownerId,
      clientName: "Feitsma Wareehouse",
      clientPhoneNumber: 1234556789,
      pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
      deliveryAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
      deliverySelected: DEPOT,
      shipmentType: "collection",
      boxQuantity: 50,
      routeNumber: routeNumber,
      driverAllocated: false,
      isUrgent: false,
      status: "transit",
      deliveryShift: "fullday",
    });
    const rawDeliveries = req.body.data.data.summary.skippedDeliveries;
    const rawCollections = req.body.data.data.summary.skippedCollections;
    const urgentDeliveryLoaded = 0;
    const forceType = "collection";
    const selectedDeliveries = selectDeliveries(
      rawDeliveries,
      vehicleCapacity,
      urgentDeliveryLoaded,
      forceType,
    );
    const initialBoxesLoaded = [...selectedDeliveries].reduce(
      (s, d) => s + d.boxQuantity,
      0,
    );

    // ── 7c. Build geo-point list for the distance matrix ─────────────────────
    //
    // IMPORTANT — every entry is a DISTINCT physical location:
    //
    //   index 0       → DEPOT (DEPOT_LAT / DEPOT_LNG env vars)
    //   index 1..D    → each delivery's deliverySelected  (client's address)
    //   index D+1..   → each collection's deliverySelected (collection point)
    //
    // deliverySelected is the STOP coordinate, not the warehouse —
    // this ensures the distance matrix has different origin/destination
    // pairs for every cell in the matrix.

    const allPoints: PositionLatLng[] = [
      DEPOT,
      ...rawDeliveries.map((s: IShipment) => s.deliverySelected),
      ...rawCollections.map((s: IShipment) => s.deliverySelected),
    ];

    const deliveryNodes: RouteNode[] = selectedDeliveries.map((s, i) => ({
      matrixIndex: i + 1,
      shipment: s,
      kind: "delivery" as StopKind,
      coords: s.deliverySelected,
      boxes: s.boxQuantity,
    }));

    const collectionNodes: RouteNode[] = rawCollections.map(
      (s: IShipment, i: number) => ({
        matrixIndex: selectedDeliveries.length + 1 + i,
        shipment: s,
        kind: "collection" as StopKind,
        coords: s.deliverySelected,
        boxes: s.boxQuantity,
      }),
    );

    // ── 7d. Fetch distance matrix (element-aware chunking) ────────────────────
    //
    // Each call sends at most CHUNK_ORIGINS × CHUNK_DESTS = 81 elements,
    // well within Google's 100-element hard cap.

    let matrix: number[][];

    try {
      matrix = await buildDistanceMatrix(allPoints);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return res.status(502).json({
        success: false,
        message: "Google Maps Distance Matrix API call failed.",
        detail: msg,
      });
    }

    // ── 7e. TSP — nearest-neighbour ordering for deliveries ───────────────────

    const orderedDeliveries = nearestNeighbourOrder(deliveryNodes, matrix, 0);

    // ── 7f. Interleave collections where capacity allows ─────────────────────

    const mixedRoute = insertCollections(
      orderedDeliveries,
      collectionNodes,
      matrix,
      vehicleCapacity,
      initialBoxesLoaded,
    );

    // ── 7g. 2-opt refinement over the full mixed sequence ─────────────────────

    const refinedRoute = twoOpt([...mixedRoute], matrix, 0);

    // ── 7h. Re-validate capacity after 2-opt reorders ─────────────────────────

    const { validRoute, finalBoxes } = validateCapacitySequence(
      refinedRoute,
      vehicleCapacity,
      initialBoxesLoaded,
    );

    if (!validRoute.length) {
      return res.status(422).json({
        success: false,
        message:
          "No stops fit within vehicleCapacity after optimization. " +
          "Try a higher vehicleCapacity or smaller boxQuantity values.",
        debug: {
          vehicleCapacity,
          smallestDelivery: rawDeliveries.length
            ? Math.min(...rawDeliveries.map((s: IShipment) => s.boxQuantity))
            : null,
          smallestCollection: rawCollections.length
            ? Math.min(...rawCollections.map((s: IShipment) => s.boxQuantity))
            : null,
        },
      });
    }

    // ── 7i. Compute totals ────────────────────────────────────────────────────

    // const orderedShipments = validRoute.map((n) => n.shipment);

    const orderedShipments = [
      wareHouseCollection,
      ...validRoute.map((n) => n.shipment),
    ];
    orderedShipments.map((s) => (s.status = "transit"));
    const deliveryCount = validRoute.filter(
      (n) => n.kind === "delivery",
    ).length;
    const collectionCount = validRoute.filter(
      (n) => n.kind === "collection",
    ).length;

    // ── 7j. Persist — atomic transaction ─────────────────────────────────────
    let initialBoxCount: number = 0;
    let continueMappingCollection = true;
    orderedShipments.forEach((s) => {
      if (s.shipmentType == "delivery" && continueMappingCollection) {
        continueMappingCollection = false;
      }
      if (s.shipmentType == "collection" && continueMappingCollection) {
        initialBoxCount += s.boxQuantity;
      }
    });
    if (initialBoxesLoaded > req.body.data.data.summary.boxesOnBoardAtReturn) {
      orderedShipments.map((s: IShipment) => {
        if (s._id == wareHouseCollection._id) {
          s.boxQuantity =
            initialBoxesLoaded -
            req.body.data.data.summary.boxesOnBoardAtReturn;
        }
      });
    } else if (
      initialBoxesLoaded < req.body.data.data.summary.boxesOnBoardAtReturn
    ) {
      orderedShipments.map((s: IShipment) => {
        if (s._id == wareHouseCollection._id) {
          s.boxQuantity =
            req.body.data.data.summary.boxesOnBoardAtReturn -
            initialBoxesLoaded;
          s.shipmentType = "delivery";
        }
      });
    } else {
      orderedShipments.map((s: IShipment) => {
        if (s._id == wareHouseCollection._id) {
          s.boxQuantity = req.body.data.data.summary.boxesOnBoardAtReturn;
          s.shipmentType = "delivery";
        }
      });
    }

    let savedRoute: any;
    try {
      savedRoute = await Route.findByIdAndUpdate(
        req.body.data.data.route._id.toString(),
        {
          $set: {
            shipments: [
              ...req.body.data.data.route.shipments,
              ...orderedShipments,
            ],
          },
        },
        { returnDocument: "after" },
      );
      await Shipment.updateMany(
        { _id: { $in: orderedShipments.map((s) => s._id) } },
        { $set: { status: "transit" } },
      );
    } catch (err) {
      throw err;
    }

    // ── 7k. Build stop manifest ───────────────────────────────────────────────

    let simBoxes = initialBoxesLoaded;
    const stopManifest = validRoute.map((node, idx) => {
      const before = simBoxes;
      simBoxes =
        node.kind === "delivery"
          ? simBoxes - node.boxes
          : simBoxes + node.boxes;
      return {
        stopNumber: idx + 1,
        action: node.kind === "delivery" ? "DROP" : "PICK",
        client: node.shipment.clientName,
        address: node.shipment.deliveryAddress,
        coords: node.coords,
        boxes: node.boxes,
        boxesBefore: before,
        boxesAfter: simBoxes,
        capacityUsedPct: Math.round((simBoxes / vehicleCapacity) * 100),
        shipmentType: node.kind,
        shipmentId: node.shipment._id,
      };
    });
    if (initialBoxesLoaded > req.body.data.data.summary.boxesOnBoardAtReturn) {
      await Shipment.updateOne(
        {
          OwnerRef: ownerId,
          routeNumber: routeNumber,
          _id: wareHouseCollection._id.toString(),
        },
        {
          $set: {
            shipmentType: "collection",

            boxQuantity:
              initialBoxesLoaded -
              req.body.data.data.summary.boxesOnBoardAtReturn,
          },
        },
        { runValidators: true },
      );
    } else if (
      initialBoxesLoaded < req.body.data.data.summary.boxesOnBoardAtReturn
    ) {
      await Shipment.updateOne(
        {
          OwnerRef: ownerId,
          routeNumber: routeNumber,
          _id: wareHouseCollection._id.toString(),
        },
        {
          $set: {
            shipmentType: "delivery",
            boxQuantity:
              req.body.data.data.summary.boxesOnBoardAtReturn -
              initialBoxesLoaded,
          },
        },
        { runValidators: true },
      );
    } else {
      await Shipment.updateOne(
        {
          OwnerRef: ownerId,
          routeNumber: routeNumber,
          _id: wareHouseCollection._id.toString(),
        },
        {
          $set: {
            shipmentType: "delivery",
            boxQuantity: req.body.data.data.summary.boxesOnBoardAtReturn,
          },
        },
        { runValidators: true },
      );
    }

    // ── 7l. Respond ───────────────────────────────────────────────────────────

    if (
      orderedShipments.length ==
      req.body.data.data.summary.skippedCollectionsCount +
        req.body.data.data.summary.skippedDeliveriesCount +
        1
    ) {
      // req.body.route = savedRoute.toObject();
      // const times = await calculateSequentialShipmentTimingsHandler(req, res);
      return res.status(200).json({
        success: true,
        message: `Mixed route created: ${deliveryCount} delivery stops + ${collectionCount} collection stops.`,
        data: {
          route: savedRoute!,
          summary: {
            // times,
            totalStops: validRoute.length,
            deliveryStops: deliveryCount,
            collectionStops: collectionCount,
            vehicleCapacity,
            boxesLoadedAtDepot: initialBoxesLoaded,
            boxesOnBoardAtReturn: finalBoxes,
            deliveryUtilizationPct: Math.round(
              (initialBoxesLoaded / vehicleCapacity) * 100,
            ),
            skippedDeliveries: rawDeliveries.length - deliveryCount,
            skippedCollections: rawCollections.length - collectionCount,
            depot: DEPOT,
            matrixSize: `${allPoints.length} × ${allPoints.length} = ${allPoints.length ** 2} elements`,
            apiCallsRequired:
              Math.ceil(allPoints.length / CHUNK_ORIGINS) *
              Math.ceil(allPoints.length / CHUNK_DESTS),
          },
          stopManifest,
        },
      });
    } else {
      let skippedDeliveries: IShipment[] = await Shipment.find({
        OwnerRef: req.userId,
        status: "pending",
        routeNumber: routeNumber,
        shipmentType: "delivery",
      });

      let skippedCollections: IShipment[] = await Shipment.find({
        OwnerRef: req.userId,
        status: "pending",
        routeNumber: routeNumber,
        shipmentType: "collection",
      });

      const skippedDeliveriesCount = skippedDeliveries.length;
      const skippedCollectionsCount = skippedCollections.length;

      if (skippedCollectionsCount > 0 || skippedDeliveriesCount > 0) {
        req.body.data = {
          data: {
            route: savedRoute,
            summary: {
              totalStops: validRoute.length,
              deliveryStops: deliveryCount,
              collectionStops: collectionCount,
              vehicleCapacity,
              boxesLoadedAtDepot: initialBoxesLoaded,
              boxesOnBoardAtReturn: finalBoxes,
              deliveryUtilizationPct: Math.round(
                (initialBoxesLoaded / vehicleCapacity) * 100,
              ),
              skippedDeliveries: skippedDeliveries,
              skippedCollections: skippedCollections,
              skippedDeliveriesCount: skippedDeliveriesCount,
              skippedCollectionsCount: skippedCollectionsCount,
              depot: DEPOT,
              matrixSize: `${allPoints.length} × ${allPoints.length} = ${allPoints.length ** 2} elements`,
              apiCallsRequired:
                Math.ceil(allPoints.length / CHUNK_ORIGINS) *
                Math.ceil(allPoints.length / CHUNK_DESTS),
            },
            stopManifest,
          },
        };
        if (forceInjectingShipmentCount > 4) {
          // req.body.route = savedRoute.toObject();
          // const times = await calculateSequentialShipmentTimingsHandler(
          //   req,
          //   res,
          // );
          return res.status(200).json({
            success: true,
            message: `Mixed route created: ${deliveryCount} delivery stops + ${collectionCount} collection stops.`,
            data: {
              route: savedRoute!,
              summary: {
                // times,
                totalStops: validRoute.length,
                deliveryStops: deliveryCount,
                collectionStops: collectionCount,
                vehicleCapacity,
                boxesLoadedAtDepot: initialBoxesLoaded,
                boxesOnBoardAtReturn: finalBoxes,
                deliveryUtilizationPct: Math.round(
                  (initialBoxesLoaded / vehicleCapacity) * 100,
                ),
                depot: DEPOT,
                matrixSize: `${allPoints.length} × ${allPoints.length} = ${allPoints.length ** 2} elements`,
                apiCallsRequired:
                  Math.ceil(allPoints.length / CHUNK_ORIGINS) *
                  Math.ceil(allPoints.length / CHUNK_DESTS),
              },
              stopManifest,
            },
          });
        }
        forceInjectingShipmentCount = forceInjectingShipmentCount + 1;

        handleAddExistingShipmentsForNumberBasedRoute(req, res);
      } else {
        // req.body.route = savedRoute.toObject();
        // const times = await calculateSequentialShipmentTimingsHandler(req, res);
        return res.status(200).json({
          success: true,
          message: `Mixed route created: ${deliveryCount} delivery stops + ${collectionCount} collection stops.`,
          data: {
            route: savedRoute!,
            summary: {
              // times,
              totalStops: validRoute.length,
              deliveryStops: deliveryCount,
              collectionStops: collectionCount,
              vehicleCapacity,
              boxesLoadedAtDepot: initialBoxesLoaded,
              boxesOnBoardAtReturn: finalBoxes,
              deliveryUtilizationPct: Math.round(
                (initialBoxesLoaded / vehicleCapacity) * 100,
              ),
              depot: DEPOT,
              matrixSize: `${allPoints.length} × ${allPoints.length} = ${allPoints.length ** 2} elements`,
              apiCallsRequired:
                Math.ceil(allPoints.length / CHUNK_ORIGINS) *
                Math.ceil(allPoints.length / CHUNK_DESTS),
            },
            stopManifest,
          },
        });
      }
    }
  }
}

export async function createOptimizedRouteHandler(
  req: Request & { userId?: string },
  res: Response,
) {
  forceInjectingShipmentCount = 0;
  const ownerId: Types.ObjectId = (req as any).userId;
  let { vehicleCapacity, deliveryShift, routeType, routeNumber } =
    req.body as CreateRouteBody;
  const shift = deliveryShift.trim().toLowerCase();
  // ── 7a. Fetch unallocated shipments (both types, in parallel) ─────────────
  let baseQuery;
  if (routeType == "number") {
    baseQuery = {
      OwnerRef: ownerId,
      routeNumber: routeNumber,
      status: { $nin: ["delivered", "cancelled", "transit", "completed"] },
    };
  } else if (routeType == "mixed") {
    if (!deliveryShift || !vehicleCapacity) {
      return res.status(400).json({ message: "All input fields are required" });
    }
    baseQuery = {
      OwnerRef: ownerId,
      deliveryShift: shift,
      routeNumber: { $exists: false },
      status: { $nin: ["delivered", "cancelled", "transit", "completed"] },
    };
  }
  let [rawDeliveries, rawCollections] = await Promise.all([
    Shipment.find({ ...baseQuery, shipmentType: "delivery" }),
    Shipment.find({ ...baseQuery, shipmentType: "collection" }),
  ]);

  if (rawDeliveries?.length == 0 && rawCollections?.length == 0) {
    return res.status(404).json({
      success: false,
      message: `No unallocated shipments found for the '${shift}' shift.`,
    });
  }
  // ── 7b. Select deliveries to load at departure ────────────────────────────
  let forcedCollections;
  let urgentCollectionLoaded = 0;
  let urgentDeliveryLoaded = 0;
  let forceType = "";
  const forcedDeliveries = rawDeliveries.filter((s) => s.isUrgent);
  if (!forcedDeliveries.length) {
    forceType = "collection";
    forcedCollections = rawCollections.filter((s) => s.isUrgent);
  } else {
    forceType = "delivery";
    forcedDeliveries.forEach((d: IShipment) => {
      urgentDeliveryLoaded += d.boxQuantity;
    });
  }

  rawDeliveries = rawDeliveries.filter((s) => !s.isUrgent);
  rawCollections = rawCollections.filter((s) => !s.isUrgent);

  let continueMapping: boolean = true;

  let capacityNeedsToBeEliminated: number = vehicleCapacity;
  let nearCollections: IShipment[] = [];

  if (
    rawCollections.length > 0 &&
    continueMapping &&
    rawDeliveries.length > 0
  ) {
    if (continueMapping) {
      rawCollections.map((s: IShipment) => {
        const nearestLocationFromLatestDelivery = getNearestLocation(
          rawDeliveries[0].deliverySelected,
          s.deliverySelected,
          DEPOT,
        );
        if (
          nearestLocationFromLatestDelivery.nearest.lat ==
            s.deliverySelected.lat &&
          nearestLocationFromLatestDelivery.nearest.lng ==
            s.deliverySelected.lng
        ) {
          if (capacityNeedsToBeEliminated - s.boxQuantity >= 0) {
            capacityNeedsToBeEliminated -= s.boxQuantity;
            rawCollections = rawCollections.filter((e) => e._id != s._id);

            nearCollections.push(s);
          } else {
            continueMapping = false;
          }
        } else {
          continueMapping = false;
        }
      });
    }
  }
  const selectedDeliveries = selectDeliveries(
    rawDeliveries,
    vehicleCapacity,
    forceType == "delivery" ? urgentDeliveryLoaded : urgentCollectionLoaded,
    forceType,
  );

  const initialBoxesLoaded = [
    ...selectedDeliveries,
    ...forcedDeliveries,
  ].reduce((s, d) => s + d.boxQuantity, 0);

  // ── 7c. Build geo-point list for the distance matrix ─────────────────────
  //
  // IMPORTANT — every entry is a DISTINCT physical location:
  //
  //   index 0       → DEPOT (DEPOT_LAT / DEPOT_LNG env vars)
  //   index 1..D    → each delivery's deliverySelected  (client's address)
  //   index D+1..   → each collection's deliverySelected (collection point)
  //
  // deliverySelected is the STOP coordinate, not the warehouse —
  // this ensures the distance matrix has different origin/destination
  // pairs for every cell in the matrix.

  const allPoints: PositionLatLng[] = [
    DEPOT,
    ...nearCollections.map((s) => s.deliverySelected),
    ...rawDeliveries.map((s) => s.deliverySelected),
    ...rawCollections.map((s) => s.deliverySelected),
  ];

  const deliveryNodes: RouteNode[] = selectedDeliveries.map((s, i) => ({
    matrixIndex: i + 1,
    shipment: s,
    kind: "delivery" as StopKind,
    coords: s.deliverySelected,
    boxes: s.boxQuantity,
  }));

  const collectionNodes: RouteNode[] = rawCollections.map((s, i) => ({
    matrixIndex: selectedDeliveries.length + 1 + i,
    shipment: s,
    kind: "collection" as StopKind,
    coords: s.deliverySelected,
    boxes: s.boxQuantity,
  }));

  // ── 7d. Fetch distance matrix (element-aware chunking) ────────────────────
  //
  // Each call sends at most CHUNK_ORIGINS × CHUNK_DESTS = 81 elements,
  // well within Google's 100-element hard cap.

  let matrix: number[][];

  try {
    matrix = await buildDistanceMatrix(allPoints);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(502).json({
      success: false,
      message: "Google Maps Distance Matrix API call failed.",
      detail: msg,
    });
  }

  // ── 7e. TSP — nearest-neighbour ordering for deliveries ───────────────────

  const orderedDeliveries = nearestNeighbourOrder(deliveryNodes, matrix, 0);

  // ── 7f. Interleave collections where capacity allows ─────────────────────

  const mixedRoute = insertCollections(
    orderedDeliveries,
    collectionNodes,
    matrix,
    vehicleCapacity,
    initialBoxesLoaded,
  );

  // ── 7g. 2-opt refinement over the full mixed sequence ─────────────────────

  const refinedRoute = twoOpt([...mixedRoute], matrix, 0);

  // ── 7h. Re-validate capacity after 2-opt reorders ─────────────────────────

  const { validRoute, finalBoxes } = validateCapacitySequence(
    refinedRoute,
    vehicleCapacity,
    initialBoxesLoaded,
  );

  // ── 7i. Compute totals ────────────────────────────────────────────────────

  let deliveryCount = 0;
  let collectionCount = 0;
  let forcedShipments: IShipment[];
  deliveryCount = validRoute.filter((n) => n.kind === "delivery").length;
  collectionCount = validRoute.filter((n) => n.kind === "collection").length;

  if (forceType == "delivery") {
    forcedShipments = forcedDeliveries || [];
    deliveryCount += forcedShipments.length;
  } else {
    forcedShipments = forcedCollections || [];
    collectionCount += forcedShipments.length;
  }

  if (!validRoute.length && forcedShipments.length == 0) {
    return res.status(422).json({
      success: false,
      message:
        "No stops fit within vehicleCapacity after optimization. " +
        "Try a higher vehicleCapacity or smaller boxQuantity values.",
      debug: {
        vehicleCapacity,
        smallestDelivery: rawDeliveries.length
          ? Math.min(...rawDeliveries.map((s) => s.boxQuantity))
          : null,
        smallestCollection: rawCollections.length
          ? Math.min(...rawCollections.map((s) => s.boxQuantity))
          : null,
      },
    });
  }

  const orderedShipments = [
    ...nearCollections,
    ...forcedShipments,
    ...validRoute.map((n) => n.shipment),
  ];
  orderedShipments.map((s) => (s.status = "transit"));

  // ── 7j. Persist — atomic transaction ─────────────────────────────────────
  let initialBoxCount: number = 0;
  let continueMappingCollection = true;
  orderedShipments.forEach((s) => {
    if (s.shipmentType == "delivery") {
      continueMappingCollection = false;
    }
    if (s.shipmentType == "collection" && continueMappingCollection) {
      initialBoxCount += s.boxQuantity;
    }
  });

  let savedRoute: IRoute;
  try {
    savedRoute = await Route.create({
      OwnerRef: ownerId,
      vehicleCapacity: vehicleCapacity,
      deliveryShift: shift,
      shipmentType: "mixed",
      routeNumber: routeNumber,
      status: "scheduled",
      totalBoxes:
        initialBoxCount == 0
          ? initialBoxesLoaded
          : initialBoxesLoaded - initialBoxCount,
      shipments: orderedShipments,
    });

    await Shipment.updateMany(
      { _id: { $in: orderedShipments.map((s) => s._id) } },
      { $set: { status: "transit" } },
    );
  } catch (err) {
    console.log("Error creating route");
    throw err;
  }

  // ── 7k. Build stop manifest ───────────────────────────────────────────────

  let simBoxes = initialBoxesLoaded;
  const stopManifest = validRoute.map((node, idx) => {
    const before = simBoxes;
    simBoxes =
      node.kind === "delivery" ? simBoxes - node.boxes : simBoxes + node.boxes;
    return {
      stopNumber: idx + 1,
      action: node.kind === "delivery" ? "DROP" : "PICK",
      client: node.shipment.clientName,
      address: node.shipment.deliveryAddress,
      coords: node.coords,
      boxes: node.boxes,
      boxesBefore: before,
      boxesAfter: simBoxes,
      capacityUsedPct: Math.round((simBoxes / vehicleCapacity) * 100),
      shipmentType: node.kind,
      shipmentId: node.shipment._id,
    };
  });

  const skippedDeliveriesCount = rawDeliveries.length - deliveryCount;
  const skippedCollectionsCount = rawCollections.length - collectionCount;

  // ── 7l. Respond ───────────────────────────────────────────────────────────
  if (
    routeType == "number" &&
    (skippedCollectionsCount > 0 || skippedDeliveriesCount > 0)
  ) {
    let skippedDeliveries: IShipment[] = await Shipment.find({
      OwnerRef: req.userId,
      status: "pending",
      routeNumber: routeNumber,
      shipmentType: "delivery",
    });
    let skippedCollections: IShipment[] = await Shipment.find({
      OwnerRef: req.userId,
      status: "pending",
      routeNumber: routeNumber,
      shipmentType: "collection",
    });
    req.body.data = {
      data: {
        route: savedRoute!,
        summary: {
          totalStops: validRoute.length,
          deliveryStops: deliveryCount,
          collectionStops: collectionCount,
          vehicleCapacity,
          boxesLoadedAtDepot: initialBoxesLoaded,
          boxesOnBoardAtReturn: finalBoxes,
          deliveryUtilizationPct: Math.round(
            (initialBoxesLoaded / vehicleCapacity) * 100,
          ),
          skippedDeliveries: skippedDeliveries,
          skippedCollections: skippedCollections,
          skippedDeliveriesCount: skippedDeliveriesCount,
          skippedCollectionsCount: skippedCollectionsCount,
          depot: DEPOT,
          matrixSize: `${allPoints.length} × ${allPoints.length} = ${allPoints.length ** 2} elements`,
          apiCallsRequired:
            Math.ceil(allPoints.length / CHUNK_ORIGINS) *
            Math.ceil(allPoints.length / CHUNK_DESTS),
        },
        stopManifest,
      },
    };
    if (forceInjectingShipmentCount > 4) {
      // req.body.route = savedRoute.toObject();
      // const times = await calculateSequentialShipmentTimingsHandler(req, res);
      return res.status(200).json({
        success: true,
        message: `Mixed route created: ${deliveryCount} delivery stops + ${collectionCount} collection stops.`,
        data: {
          route: savedRoute!,
          summary: {
            // times,
            totalStops: validRoute.length,
            deliveryStops: deliveryCount,
            collectionStops: collectionCount,
            vehicleCapacity,
            boxesLoadedAtDepot: initialBoxesLoaded,
            boxesOnBoardAtReturn: finalBoxes,
            deliveryUtilizationPct: Math.round(
              (initialBoxesLoaded / vehicleCapacity) * 100,
            ),
            depot: DEPOT,
            matrixSize: `${allPoints.length} × ${allPoints.length} = ${allPoints.length ** 2} elements`,
            apiCallsRequired:
              Math.ceil(allPoints.length / CHUNK_ORIGINS) *
              Math.ceil(allPoints.length / CHUNK_DESTS),
          },
          stopManifest,
        },
      });
    }
    forceInjectingShipmentCount = forceInjectingShipmentCount + 1;
    handleAddExistingShipmentsForNumberBasedRoute(req, res);
  } else {
    // req.body.route = savedRoute.toObject();
    // const times = await calculateSequentialShipmentTimingsHandler(req, res);
    return res.status(200).json({
      success: true,
      message: `Mixed route created: ${deliveryCount} delivery stops + ${collectionCount} collection stops.`,
      data: {
        route: savedRoute!,
        summary: {
          // times,
          totalStops: validRoute.length,
          deliveryStops: deliveryCount,
          collectionStops: collectionCount,
          vehicleCapacity,
          boxesLoadedAtDepot: initialBoxesLoaded,
          boxesOnBoardAtReturn: finalBoxes,
          deliveryUtilizationPct: Math.round(
            (initialBoxesLoaded / vehicleCapacity) * 100,
          ),
          depot: DEPOT,
          matrixSize: `${allPoints.length} × ${allPoints.length} = ${allPoints.length ** 2} elements`,
          apiCallsRequired:
            Math.ceil(allPoints.length / CHUNK_ORIGINS) *
            Math.ceil(allPoints.length / CHUNK_DESTS),
        },
        stopManifest,
      },
    });
  }
}
