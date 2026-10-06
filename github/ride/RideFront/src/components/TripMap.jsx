/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Map as MapLibreMap, Marker, NavigationControl, LngLatBounds } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./TripMap.css";

// Free CARTO "Voyager" raster basemap (OpenStreetMap data): no API key, no billing.
const MAP_STYLE = {
  version: 8,
  sources: {
    base: {
      type: "raster",
      tiles: ["a", "b", "c", "d"].map(
        (s) => `https://${s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png`
      ),
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO",
      maxzoom: 19,
    },
  },
  layers: [{ id: "base", type: "raster", source: "base" }],
};

const ROUTE_SOURCE = "route";
const DEFAULT_CENTER = [77.209, 28.6139];

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

/**
 * Interactive trip map.
 *  - markers: [{ kind: "pickup" | "destination" | "captain" | "me", lngLat: [lng, lat] }]
 *  - route:   GeoJSON LineString geometry, drawn and fitted into view
 *  - padding: space (px) covered by floating UI, so fitted content stays visible
 *  - onPick:  called with [lng, lat] when the user long-presses / right-clicks the map
 */
function TripMap({ markers = [], route = null, padding, onPick, className = "" }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const loadedRef = useRef(false);
  const markerRefs = useRef(new Map());
  const latest = useRef({ markers, route, padding, onPick });
  latest.current = { markers, route, padding, onPick };

  const sync = () => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;
    const { markers: items, route: line, padding: pad } = latest.current;

    // Markers: reuse by kind so a moving driver glides instead of re-mounting.
    const seen = new Set();
    for (const { kind, lngLat } of items) {
      if (!lngLat) continue;
      seen.add(kind);
      const existing = markerRefs.current.get(kind);
      if (existing) existing.setLngLat(lngLat);
      else {
        markerRefs.current.set(
          kind,
          new Marker({ element: markerElement(kind, LABELS[kind] || kind) })
            .setLngLat(lngLat)
            .addTo(map)
        );
      }
    }
    for (const [kind, marker] of markerRefs.current) {
      if (!seen.has(kind)) {
        marker.remove();
        markerRefs.current.delete(kind);
      }
    }

    // Route line
    const data = line
      ? { type: "Feature", geometry: line }
      : { type: "FeatureCollection", features: [] };
    map.getSource(ROUTE_SOURCE)?.setData(data);

    // Camera
    const points = line ? line.coordinates : items.map((m) => m.lngLat).filter(Boolean);
    const options = { padding: pad || 60, duration: 900, maxZoom: 16 };
    if (points.length > 1) {
      const bounds = points.reduce(
        (b, p) => b.extend(p),
        new LngLatBounds(points[0], points[0])
      );
      map.fitBounds(bounds, options);
    } else if (points.length === 1) {
      map.easeTo({ center: points[0], zoom: Math.max(map.getZoom(), 14.5), duration: 900 });
    }
  };

  useEffect(() => {
    const markersForCleanup = markerRefs.current;
    const map = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: 11,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      map.addSource(ROUTE_SOURCE, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "route-casing",
        type: "line",
        source: ROUTE_SOURCE,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#ffffff", "line-width": 9, "line-opacity": 0.95 },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: ROUTE_SOURCE,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#0f9d72", "line-width": 5 },
      });
      loadedRef.current = true;
      sync();
    });

    // Long-press (touch) or right-click (desktop) drops a pin.
    const pick = (e) => latest.current.onPick?.([e.lngLat.lng, e.lngLat.lat]);
    map.on("contextmenu", pick);
    let pressTimer;
    const cancelPress = () => clearTimeout(pressTimer);
    map.on("touchstart", (e) => {
      if (e.points?.length !== 1) return cancelPress();
      pressTimer = setTimeout(() => pick(e), 650);
    });
    ["touchend", "touchmove", "touchcancel", "dragstart", "zoomstart"].forEach((evt) =>
      map.on(evt, cancelPress)
    );

    const resize = new ResizeObserver(() => map.resize());
    resize.observe(containerRef.current);

    return () => {
      cancelPress();
      resize.disconnect();
      markersForCleanup.clear();
      loadedRef.current = false;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const key = JSON.stringify([markers.map((m) => [m.kind, m.lngLat]), route?.coordinates?.length, padding]);
  useEffect(sync, [key]);

  return <div ref={containerRef} className={`trip-map ${className}`} />;
}

export default TripMap;
