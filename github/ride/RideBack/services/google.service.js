"use strict";

// Google Maps Platform provider: Geocoding, Places (New) autocomplete and Routes.
// All map data in the app comes from here; GOOGLE_MAPS_API is a server-side key.
const axios = require("axios");
const { AppError, NotFoundError } = require("../utils/AppError");

const http = axios.create({ timeout: 8000 });

const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";
const ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";

// Failures the client can act on are given stable codes; anything else (bad key, quota,
// network) is a MAPS_UNAVAILABLE 502 and the real reason is logged by the caller.
const mapsUnavailable = (detail) => {
  const error = new AppError("Maps are temporarily unavailable. Please try again in a moment.", 502, "MAPS_UNAVAILABLE");
  error.detail = detail;
  return error;
};
const placeNotFound = () =>
  new NotFoundError("We could not find that address. Try adding the area or city.", "PLACE_NOT_FOUND");
const noRoute = () =>
  new AppError("We could not find a driving route between those places.", 422, "NO_ROUTE");

function apiKey() {
  const key = process.env.GOOGLE_MAPS_API;
  if (!key) throw mapsUnavailable("GOOGLE_MAPS_API is not configured.");
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
    let data;
    try {
      ({ data } = await http.get(GEOCODE_URL, { params: { address, key } }));
    } catch (error) {
      throw mapsUnavailable(error.message);
    }
    if (data.status === "ZERO_RESULTS" || (data.status === "OK" && !data.results?.[0])) throw placeNotFound();
    if (data.status !== "OK") throw mapsUnavailable(`Geocoding ${data.status}: ${data.error_message || ""}`);
    const { lat, lng } = data.results[0].geometry.location;
    return { ltd: lat, lng };
  });
}

async function getAutoCompleteSuggestions(input) {
  let data;
  try {
    ({ data } = await http.post(
      AUTOCOMPLETE_URL,
      { input },
      {
        headers: {
          "X-Goog-Api-Key": apiKey(),
          "X-Goog-FieldMask": "suggestions.placePrediction.text.text",
        },
      },
    ));
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw mapsUnavailable(error.response?.data?.error?.message || error.message);
  }
  return (data.suggestions || []).map((s) => s.placePrediction?.text?.text).filter(Boolean);
}

async function reverseGeocode(lat, lng) {
  const key = apiKey();
  let data;
  try {
    ({ data } = await http.get(GEOCODE_URL, { params: { latlng: `${lat},${lng}`, key } }));
  } catch (error) {
    throw mapsUnavailable(error.message);
  }
  if (data.status === "ZERO_RESULTS") return null;
  if (data.status !== "OK") throw mapsUnavailable(`Geocoding ${data.status}: ${data.error_message || ""}`);
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
  let data;
  try {
    ({ data } = await http.post(
      ROUTES_URL,
      { origin: waypoint(from), destination: waypoint(to), travelMode: "DRIVE" },
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
        },
      },
    ));
  } catch (error) {
    throw mapsUnavailable(error.response?.data?.error?.message || error.message);
  }
  const route = data.routes?.[0];
  if (!route) throw noRoute();
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
  return err.detail || body?.error?.message || body?.error_message || err.message;
}

module.exports = {
  describeError,
  getAddressCoordinate,
  getAutoCompleteSuggestions,
  reverseGeocode,
  getRoute,
};
