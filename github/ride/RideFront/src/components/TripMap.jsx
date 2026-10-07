/* global google */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import "./TripMap.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// Advanced markers need a map ID; Google's demo ID works without cloud styling.
const MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID";
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 };

let optionsSet = false;
function loadGoogleMaps() {
  if (!optionsSet) {
    setOptions({ key: API_KEY, v: "weekly" });
    optionsSet = true;
  }
  return Promise.all([importLibrary("maps"), importLibrary("marker")]);
}

function markerElement(kind, label) {
  const el = document.createElement("div");
  el.className = `trip-marker trip-marker-${kind}`;
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", label);
  el.innerHTML = '<span class="trip-marker-pulse"></span><span class="trip-marker-dot"></span>';
  return el;
}

const LABELS = {
  pickup: "Pickup",
  destination: "Drop-off",
  captain: "Driver",
  me: "You",
};

const toLatLng = ([lng, lat]) => ({ lat, lng });

/**
 * Interactive trip map (Google Maps JavaScript API).
 *  - markers: [{ kind: "pickup" | "destination" | "captain" | "me", lngLat: [lng, lat] }]
 *  - route:   GeoJSON LineString geometry, drawn and fitted into view
 *  - padding: space (px) covered by floating UI, so fitted content stays visible
 *  - onPick:  called with [lng, lat] when the user long-presses / right-clicks the map
 */
function TripMap({ markers = [], route = null, padding, onPick, className = "" }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const linesRef = useRef([]);
  const markerRefs = useRef(new Map());
  const latest = useRef({ markers, route, padding, onPick });
  latest.current = { markers, route, padding, onPick };
  const [status, setStatus] = useState(API_KEY ? "loading" : "missing-key");

  const sync = () => {
    const map = mapRef.current;
    if (!map) return;
    const { markers: items, route: line, padding: pad } = latest.current;

    // Markers: reuse by kind so a moving driver glides instead of re-mounting.
    const seen = new Set();
    for (const { kind, lngLat } of items) {
      if (!lngLat) continue;
      seen.add(kind);
      const position = toLatLng(lngLat);
      const existing = markerRefs.current.get(kind);
      if (existing) existing.position = position;
      else {
        markerRefs.current.set(
          kind,
          new google.maps.marker.AdvancedMarkerElement({
            map,
            position,
            content: markerElement(kind, LABELS[kind] || kind),
          })
        );
      }
    }
    for (const [kind, marker] of markerRefs.current) {
      if (!seen.has(kind)) {
        marker.map = null;
        markerRefs.current.delete(kind);
      }
    }

    // Route line: a white casing under the brand-green stroke.
    linesRef.current.forEach((l) => l.setMap(null));
    linesRef.current = [];
    if (line?.coordinates?.length > 1) {
      const path = line.coordinates.map(toLatLng);
      const style = { path, map, clickable: false };
      linesRef.current = [
        new google.maps.Polyline({ ...style, strokeColor: "#ffffff", strokeOpacity: 0.95, strokeWeight: 9, zIndex: 1 }),
        new google.maps.Polyline({ ...style, strokeColor: "#0f9d72", strokeOpacity: 1, strokeWeight: 5, zIndex: 2 }),
      ];
    }

    // Camera
    const points = line ? line.coordinates : items.map((m) => m.lngLat).filter(Boolean);
    if (points.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      points.forEach((p) => bounds.extend(toLatLng(p)));
      map.fitBounds(bounds, pad || 60);
    } else if (points.length === 1) {
      map.panTo(toLatLng(points[0]));
      map.setZoom(Math.max(map.getZoom() || 0, 15));
    }
  };

  useEffect(() => {
    if (!API_KEY) return undefined;
    let cancelled = false;
    let pressTimer;
    const cancelPress = () => clearTimeout(pressTimer);
    const container = containerRef.current;
    const markersForCleanup = markerRefs.current;
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
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        });
        mapRef.current = map;

        // Long-press (touch) or right-click (desktop) drops a pin.
        const pick = (latLng) => latest.current.onPick?.([latLng.lng(), latLng.lat()]);
        map.addListener("contextmenu", (e) => pick(e.latLng));
        ["dragstart", "zoom_changed"].forEach((evt) => map.addListener(evt, cancelPress));

        // Touch long-press needs a projection to turn the finger position into a coordinate.
        const overlay = new google.maps.OverlayView();
        overlay.onAdd = () => {};
        overlay.draw = () => {};
        overlay.onRemove = () => {};
        overlay.setMap(map);
        overlayRef.current = overlay;
        const onTouchStart = (e) => {
          if (e.touches.length !== 1) return cancelPress();
          const rect = container.getBoundingClientRect();
          const point = new google.maps.Point(
            e.touches[0].clientX - rect.left,
            e.touches[0].clientY - rect.top
          );
          pressTimer = setTimeout(() => {
            const latLng = overlay.getProjection()?.fromContainerPixelToLatLng(point);
            if (latLng) pick(latLng);
          }, 650);
        };
        const cancelEvents = ["touchend", "touchmove", "touchcancel"];
        container.addEventListener("touchstart", onTouchStart, { passive: true });
        cancelEvents.forEach((evt) => container.addEventListener(evt, cancelPress, { passive: true }));
        cleanups.push(() => {
          container.removeEventListener("touchstart", onTouchStart);
          cancelEvents.forEach((evt) => container.removeEventListener(evt, cancelPress));
        });

        setStatus("ready");
        sync();
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
      cancelPress();
      cleanups.forEach((fn) => fn());
      linesRef.current.forEach((l) => l.setMap(null));
      linesRef.current = [];
      markersForCleanup.forEach((m) => {
        m.map = null;
      });
      markersForCleanup.clear();
      overlayRef.current?.setMap(null);
      overlayRef.current = null;
      mapRef.current = null;
    };
  }, []);

  const key = JSON.stringify([markers.map((m) => [m.kind, m.lngLat]), route?.coordinates?.length, padding]);
  useEffect(sync, [key]);

  return (
    <div className={`trip-map ${className}`}>
      <div ref={containerRef} className="trip-map-canvas" />
      {status !== "ready" && status !== "loading" && (
        <div className="trip-map-notice" role="alert">
          {status === "missing-key"
            ? "Map unavailable: the Google Maps key is not configured."
            : "Map failed to load. Check your connection and the Google Maps key."}
        </div>
      )}
    </div>
  );
}

export default TripMap;
