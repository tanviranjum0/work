/* global google */
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import "./TripMap.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// Advanced markers need a map ID; Google's demo ID works without cloud styling.
const MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID";
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 };
const GLIDE_MS = 900;

let optionsSet = false;
function loadGoogleMaps() {
  if (!optionsSet) {
    setOptions({ key: API_KEY, v: "weekly" });
    optionsSet = true;
  }
  return Promise.all([importLibrary("maps"), importLibrary("marker")]);
}

const LABELS = { pickup: "Pickup", destination: "Drop-off", captain: "Driver", me: "You" };

function markerElement(kind) {
  const el = document.createElement("div");
  el.className = `trip-marker trip-marker-${kind}`;
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", LABELS[kind] || kind);
  if (kind === "captain") {
    // A navigation arrow that rotates with the direction of travel.
    el.innerHTML =
      '<span class="trip-marker-pulse"></span><span class="trip-marker-arrow"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 2.5 19.5 21 12 17l-7.5 4z" fill="#fff"/></svg></span>';
  } else {
    el.innerHTML = '<span class="trip-marker-pulse"></span><span class="trip-marker-dot"></span>';
  }
  return el;
}

const toLatLng = ([lng, lat]) => ({ lat, lng });

/**
 * Interactive trip map (Google Maps JavaScript API).
 *  - markers:  [{ kind: "pickup" | "destination" | "captain" | "me", lngLat: [lng, lat], heading? }]
 *  - route:    GeoJSON LineString, drawn under the markers
 *  - padding:  px covered by floating UI, so framed content stays visible ({top,right,bottom,left})
 *  - fitKey:   the camera re-frames the route/markers only when this value changes (a new
 *              phase, a new route), never on every GPS tick, so people can pan freely.
 *  - follow:   marker kind to keep in view while moving, until the person drags the map
 *  - onPick:   called with [lng, lat] on right-click / long-press
 *  - onFollowChange(isFollowing): lets the screen show a "Recenter" button after a manual pan
 * The ref exposes recenter().
 */
const TripMap = forwardRef(function TripMap(
  { markers = [], route = null, padding, fitKey, follow, onPick, onFollowChange, className = "" },
  ref,
) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const linesRef = useRef([]);
  const markerRefs = useRef(new Map()); // kind -> { marker, el, raf, last }
  const detachedRef = useRef(false); // true once the person has panned away
  const lastFitKey = useRef(undefined);
  const [status, setStatus] = useState(API_KEY ? "loading" : "missing-key");
  const latest = useRef({});
  latest.current = { markers, route, padding, fitKey, follow, onPick, onFollowChange };

  const frame = () => {
    const map = mapRef.current;
    if (!map) return;
    const { markers: items, route: line, padding: pad } = latest.current;
    const points = [];
    if (line?.coordinates?.length > 1) points.push(...line.coordinates);
    else items.forEach((item) => item.lngLat && points.push(item.lngLat));
    if (!points.length) return;
    if (points.length === 1) {
      map.panTo(toLatLng(points[0]));
      map.setZoom(Math.max(map.getZoom() || 0, 15));
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    points.forEach((point) => bounds.extend(toLatLng(point)));
    map.fitBounds(bounds, pad || 60);
  };

  const recenter = () => {
    detachedRef.current = false;
    latest.current.onFollowChange?.(true);
    const { follow: kind, markers: items } = latest.current;
    const target = kind && items.find((item) => item.kind === kind)?.lngLat;
    if (target && mapRef.current) {
      mapRef.current.panTo(toLatLng(target));
      mapRef.current.setZoom(Math.max(mapRef.current.getZoom() || 0, 16));
    } else frame();
  };
  useImperativeHandle(ref, () => ({ recenter, frame }));

  // Glide a marker to a new position instead of teleporting it between GPS fixes.
  const glideTo = (entry, next) => {
    cancelAnimationFrame(entry.raf);
    const from = entry.last;
    if (!from) {
      entry.marker.position = next;
      entry.last = next;
      return;
    }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / GLIDE_MS);
      const eased = 1 - (1 - t) ** 3;
      entry.last = {
        lat: from.lat + (next.lat - from.lat) * eased,
        lng: from.lng + (next.lng - from.lng) * eased,
      };
      entry.marker.position = entry.last;
      if (t < 1) entry.raf = requestAnimationFrame(step);
    };
    entry.raf = requestAnimationFrame(step);
  };

  const syncMarkers = () => {
    const map = mapRef.current;
    if (!map) return;
    const seen = new Set();
    for (const { kind, lngLat, heading } of latest.current.markers) {
      if (!lngLat) continue;
      seen.add(kind);
      const position = toLatLng(lngLat);
      let entry = markerRefs.current.get(kind);
      if (!entry) {
        const el = markerElement(kind);
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position,
          content: el,
          zIndex: kind === "captain" ? 3 : kind === "me" ? 2 : 1,
        });
        entry = { marker, el, raf: 0, last: position };
        markerRefs.current.set(kind, entry);
      } else if (kind === "captain") glideTo(entry, position);
      else {
        entry.marker.position = position;
        entry.last = position;
      }
      if (kind === "captain" && Number.isFinite(heading)) {
        const arrow = entry.el.querySelector(".trip-marker-arrow");
        if (arrow) arrow.style.transform = `rotate(${heading}deg)`;
      }
    }
    for (const [kind, entry] of markerRefs.current) {
      if (!seen.has(kind)) {
        cancelAnimationFrame(entry.raf);
        entry.marker.map = null;
        markerRefs.current.delete(kind);
      }
    }
  };

  const syncRoute = () => {
    const map = mapRef.current;
    if (!map) return;
    const line = latest.current.route;
    const path = line?.coordinates?.length > 1 ? line.coordinates.map(toLatLng) : null;
    if (!path) {
      linesRef.current.forEach((item) => item.setMap(null));
      linesRef.current = [];
      return;
    }
    if (linesRef.current.length) {
      linesRef.current.forEach((item) => item.setPath(path));
      return;
    }
    const base = { path, map, clickable: false, strokeLineCap: "round" };
    linesRef.current = [
      new google.maps.Polyline({ ...base, strokeColor: "#ffffff", strokeOpacity: 0.95, strokeWeight: 9, zIndex: 1 }),
      new google.maps.Polyline({ ...base, strokeColor: "#0a8060", strokeOpacity: 1, strokeWeight: 5, zIndex: 2 }),
    ];
  };

  // Map creation (once)
  useEffect(() => {
    if (!API_KEY) return undefined;
    let cancelled = false;
    let pressTimer;
    const cancelPress = () => clearTimeout(pressTimer);
    const container = containerRef.current;
    const cleanups = [];

    loadGoogleMaps()
      .then(([{ Map }]) => {
        if (cancelled) return;
        const map = new Map(container, {
          center: DEFAULT_CENTER,
          zoom: 11,
          mapId: MAP_ID,
          gestureHandling: "greedy",
          clickableIcons: false,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
        });
        mapRef.current = map;

        // Dragging the map hands control to the person until they tap Recenter.
        map.addListener("dragstart", () => {
          cancelPress();
          if (!detachedRef.current) {
            detachedRef.current = true;
            latest.current.onFollowChange?.(false);
          }
        });

        // Long-press (touch) or right-click (desktop) drops a pin.
        const pick = (latLng) => latest.current.onPick?.([latLng.lng(), latLng.lat()]);
        map.addListener("contextmenu", (event) => pick(event.latLng));
        map.addListener("zoom_changed", cancelPress);

        // Touch long-press needs a projection to turn the finger position into a coordinate.
        const overlay = new google.maps.OverlayView();
        overlay.onAdd = () => {};
        overlay.draw = () => {};
        overlay.onRemove = () => {};
        overlay.setMap(map);
        overlayRef.current = overlay;
        const onTouchStart = (event) => {
          if (event.touches.length !== 1 || !latest.current.onPick) return cancelPress();
          const rect = container.getBoundingClientRect();
          const point = new google.maps.Point(
            event.touches[0].clientX - rect.left,
            event.touches[0].clientY - rect.top,
          );
          pressTimer = setTimeout(() => {
            const latLng = overlay.getProjection()?.fromContainerPixelToLatLng(point);
            if (latLng) pick(latLng);
          }, 650);
        };
        const cancelEvents = ["touchend", "touchmove", "touchcancel"];
        container.addEventListener("touchstart", onTouchStart, { passive: true });
        cancelEvents.forEach((name) => container.addEventListener(name, cancelPress, { passive: true }));
        cleanups.push(() => {
          container.removeEventListener("touchstart", onTouchStart);
          cancelEvents.forEach((name) => container.removeEventListener(name, cancelPress));
        });

        setStatus("ready");
        syncRoute();
        syncMarkers();
        lastFitKey.current = latest.current.fitKey;
        frame();
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
      cancelPress();
      cleanups.forEach((fn) => fn());
      linesRef.current.forEach((item) => item.setMap(null));
      linesRef.current = [];
      markerRefs.current.forEach((entry) => {
        cancelAnimationFrame(entry.raf);
        entry.marker.map = null;
      });
      markerRefs.current.clear();
      overlayRef.current?.setMap(null);
      overlayRef.current = null;
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Markers and route follow props cheaply; the camera is handled separately below.
  const markerSignature = JSON.stringify(markers.map((m) => [m.kind, m.lngLat, Math.round(m.heading || 0)]));
  useEffect(syncMarkers, [markerSignature]); // eslint-disable-line react-hooks/exhaustive-deps
  const routeSignature = route?.coordinates ? `${route.coordinates.length}:${route.coordinates[0]}:${route.coordinates.at(-1)}` : "";
  useEffect(syncRoute, [routeSignature]); // eslint-disable-line react-hooks/exhaustive-deps

  // Camera: a new fitKey (new phase / route) resets any manual pan. The frame is also redone
  // when the floating panel settles at its real height, unless the person has panned away.
  // Debounced so a resizing panel does not make the camera jitter.
  useEffect(() => {
    if (!mapRef.current) return undefined;
    const keyChanged = lastFitKey.current !== fitKey;
    if (keyChanged) {
      lastFitKey.current = fitKey;
      detachedRef.current = false;
      onFollowChange?.(true);
    } else if (detachedRef.current) return undefined;
    const id = setTimeout(frame, keyChanged ? 60 : 180);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, padding?.bottom, padding?.left, padding?.top]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !follow || detachedRef.current) return;
    const target = markers.find((item) => item.kind === follow)?.lngLat;
    if (!target) return;
    const bounds = map.getBounds();
    const here = toLatLng(target);
    // Only move the camera when the followed marker is about to leave the screen.
    if (!bounds || !bounds.contains(here)) map.panTo(here);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerSignature, follow]);

  return (
    <div className={`trip-map ${className}`}>
      <div ref={containerRef} className="trip-map-canvas" />
      {status !== "ready" && status !== "loading" && (
        <div className="trip-map-notice" role="alert">
          {status === "missing-key"
            ? "Map unavailable: the Google Maps key is not configured."
            : "The map failed to load. Check your connection and refresh."}
        </div>
      )}
      {status === "loading" && <div className="trip-map-loading" aria-hidden="true" />}
    </div>
  );
});

export default TripMap;
