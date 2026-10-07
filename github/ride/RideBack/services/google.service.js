"use strict";

// Google Maps Platform provider: Geocoding, Places (New) autocomplete and Routes.
// All map data in the app comes from here; GOOGLE_MAPS_API is a server-side key.
const axios = require("axios");

const http = axios.create({ timeout: 8000 });

const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";
const ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";

function apiKey() {
  const key = process.env.GOOGLE_MAPS_API;
  if (!key) throw new Error("Maps integration is not configured.");
  return key;
}

// Small TTL cache: the same pickup/destination is geocoded repeatedly per ride, and every
// Google call is billed.
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX = 500;
const cache = new Map();
async function cached(key, load) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await load();
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
  return value;
}

const COORDINATES = /^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/;

async function getAddressCoordinate(address) {
  // A raw "lat,lng" pair (a captain's live GPS fix) needs no geocoding.
  const pair = COORDINATES.exec(address);
  if (pair && Math.abs(pair[1]) <= 90 && Math.abs(pair[2]) <= 180) {
    return { ltd: Number(pair[1]), lng: Number(pair[2]) };
  }
  const key = apiKey();
  return cached(`geo:${address.trim().toLowerCase()}`, async () => {
    const { data } = await http.get(GEOCODE_URL, { params: { address, key } });
    if (data.status !== "OK" || !data.results?.[0]) {
      throw new Error(`Geocoding ${data.status}: ${data.error_message || "no results"}`);
    }
    const { lat, lng } = data.results[0].geometry.location;
    return { ltd: lat, lng };
  });
}

async function getAutoCompleteSuggestions(input) {
  const { data } = await http.post(
    AUTOCOMPLETE_URL,
    { input },
    {
      headers: {
        "X-Goog-Api-Key": apiKey(),
        "X-Goog-FieldMask": "suggestions.placePrediction.text.text",
      },
    }
  );
  return (data.suggestions || [])
    .map((s) => s.placePrediction?.text?.text)
    .filter(Boolean);
}

async function reverseGeocode(lat, lng) {
  const key = apiKey();
  const { data } = await http.get(GEOCODE_URL, { params: { latlng: `${lat},${lng}`, key } });
  if (data.status === "ZERO_RESULTS") return null;
  if (data.status !== "OK") throw new Error(`Geocoding ${data.status}: ${data.error_message || ""}`);
  return data.results[0]?.formatted_address || null;
}

// Decodes a Google encoded polyline (precision 5) into GeoJSON [lng, lat] pairs.
function decodePolyline(encoded) {
  const coordinates = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  const next = () => {
    let result = 0;
    let shift = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    return result & 1 ? ~(result >> 1) : result >> 1;
  };
  while (index < encoded.length) {
    lat += next();
    lng += next();
    coordinates.push([lng / 1e5, lat / 1e5]);
  }
  return coordinates;
}

function formatDuration(seconds) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
}

// Returns the element shape ride.service.js consumes, plus from/to/geometry for the client map.
async function getRoute(origin, destination) {
  const key = apiKey();
  const [from, to] = await Promise.all([
    getAddressCoordinate(origin),
    getAddressCoordinate(destination),
  ]);
  const waypoint = ({ ltd, lng }) => ({ location: { latLng: { latitude: ltd, longitude: lng } } });
  const { data } = await http.post(
    ROUTES_URL,
    { origin: waypoint(from), destination: waypoint(to), travelMode: "DRIVE" },
    {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
      },
    }
  );
  const route = data.routes?.[0];
  if (!route) throw new Error("No routes found");
  const distance = route.distanceMeters || 0;
  const seconds = parseInt(route.duration, 10) || 0;
  return {
    status: "OK",
    distance: { value: distance, text: `${(distance / 1000).toFixed(1)} km` },
    duration: { value: seconds, text: formatDuration(seconds) },
    from,
    to,
    geometry: route.polyline?.encodedPolyline
      ? { type: "LineString", coordinates: decodePolyline(route.polyline.encodedPolyline) }
      : null,
  };
}

// Google's own error text (never the key) so a misconfigured key/API shows up in the logs.
function describeError(err) {
  const body = err.response?.data;
  return body?.error?.message || body?.error_message || err.message;
}

module.exports = { describeError, getAddressCoordinate, getAutoCompleteSuggestions, reverseGeocode, getRoute };
