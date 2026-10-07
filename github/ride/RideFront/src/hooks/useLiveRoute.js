import { useEffect, useMemo, useRef, useState } from "react";
import api from "../utils/api";
import { distanceMeters, isPoint, toCoordString } from "../utils/geo";

const OFF_ROUTE_METERS = 160;
const MIN_REFETCH_MS = 15_000;
const SAFETY_REFETCH_MS = 150_000;

// Nearest point on a [lng, lat][] path to `point`: its segment index, the distance to the
// path, and the metres still to travel from there to the end.
function snapToPath(path, point) {
  let best = { index: 0, distance: Infinity, t: 0 };
  const cosLat = Math.cos((point.ltd * Math.PI) / 180);
  for (let i = 0; i < path.length - 1; i += 1) {
    const [x1, y1] = path[i];
    const [x2, y2] = path[i + 1];
    const dx = (x2 - x1) * cosLat;
    const dy = y2 - y1;
    const lengthSq = dx * dx + dy * dy;
    let t = 0;
    if (lengthSq > 0) {
      t = (((point.lng - x1) * cosLat) * dx + (point.ltd - y1) * dy) / lengthSq;
      t = Math.max(0, Math.min(1, t));
    }
    const projected = { ltd: y1 + (y2 - y1) * t, lng: x1 + (x2 - x1) * t };
    const distance = distanceMeters(point, projected);
    if (distance < best.distance) best = { index: i, distance, t, projected };
  }
  return best;
}

function remainingAlong(path, snap) {
  let meters = distanceMeters(snap.projected, { ltd: path[snap.index + 1][1], lng: path[snap.index + 1][0] });
  for (let i = snap.index + 1; i < path.length - 1; i += 1) {
    meters += distanceMeters({ ltd: path[i][1], lng: path[i][0] }, { ltd: path[i + 1][1], lng: path[i + 1][0] });
  }
  return meters;
}

/**
 * Route from `from` (a moving point such as the driver) to `to`.
 *
 * The directions API is called when the destination changes, when the point drifts off the
 * line (a missed turn), and every couple of minutes as a safety net. In between, progress is
 * computed locally by snapping the live position onto the saved line. That keeps the drawn
 * route and ETA smooth and costs one request per leg instead of one every few seconds.
 *
 * Returns { geometry, distanceMeters, durationSeconds, loading, error } where geometry is
 * trimmed to what is left of the trip.
 */
export default function useLiveRoute({ from, to, enabled = true }) {
  const [route, setRoute] = useState(null); // { path, distance, duration, toKey }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastFetch = useRef({ at: 0, toKey: "" });
  const inFlight = useRef(false);

  const valid = enabled && isPoint(from) && isPoint(to);
  const toKey = valid ? toCoordString(to) : "";

  // Local progress along the stored route
  const progress = useMemo(() => {
    if (!route || route.toKey !== toKey || !isPoint(from)) return null;
    const snap = snapToPath(route.path, from);
    return { snap, remaining: remainingAlong(route.path, snap) };
  }, [route, toKey, from]);

  const offRoute = Boolean(progress && progress.snap.distance > OFF_ROUTE_METERS);
  const stale = Boolean(route && Date.now() - lastFetch.current.at > SAFETY_REFETCH_MS);

  useEffect(() => {
    if (!valid) return undefined;
    const destinationChanged = lastFetch.current.toKey !== toKey;
    const sinceLast = Date.now() - lastFetch.current.at;
    const needsFetch =
      !route || destinationChanged || (offRoute && sinceLast > MIN_REFETCH_MS) || (stale && sinceLast > MIN_REFETCH_MS);
    if (!needsFetch || inFlight.current) return undefined;

    const controller = new AbortController();
    inFlight.current = true;
    lastFetch.current = { at: Date.now(), toKey };
    setLoading(true);
    api
      .get("/map/route", {
        params: { origin: toCoordString(from), destination: toCoordString(to) },
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (data.geometry?.coordinates?.length > 1) {
          setRoute({
            path: data.geometry.coordinates,
            distance: data.distance.value,
            duration: data.duration.value,
            toKey,
          });
          setError("");
        }
      })
      .catch((err) => {
        if (err.name !== "CanceledError") setError(err.userMessage || "Route unavailable");
      })
      .finally(() => {
        inFlight.current = false;
        setLoading(false);
      });
    return () => {
      controller.abort();
      inFlight.current = false;
    };
    // `from` is read through the effect closure on purpose: only the triggers above refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid, toKey, offRoute, stale, route === null]);

  // Reset when the leg ends so the next one starts clean.
  useEffect(() => {
    if (!valid) {
      setRoute(null);
      lastFetch.current = { at: 0, toKey: "" };
    }
  }, [valid]);

  return useMemo(() => {
    if (!route || route.toKey !== toKey) {
      return { geometry: null, distanceMeters: null, durationSeconds: null, loading, error };
    }
    const remaining = progress ? progress.remaining : route.distance;
    const ratio = route.distance > 0 ? route.duration / route.distance : 0;
    const geometry = progress
      ? {
          type: "LineString",
          coordinates: [
            [progress.snap.projected.lng, progress.snap.projected.ltd],
            ...route.path.slice(progress.snap.index + 1),
          ],
        }
      : { type: "LineString", coordinates: route.path };
    return {
      geometry,
      distanceMeters: Math.round(remaining),
      durationSeconds: Math.max(30, Math.round(remaining * ratio)),
      loading,
      error,
    };
  }, [route, toKey, progress, loading, error]);
}
