"use strict";

// Keyless map provider (Photon/Nominatim data + OSRM routing) used when GOOGLE_MAPS_API
// is not configured, so the app runs on free hosting with no billing account.
const axios = require("axios");

const PHOTON_URL = process.env.PHOTON_URL || "https://photon.komoot.io";
const OSRM_URL = process.env.OSRM_URL || "https://router.project-osrm.org";
const http = axios.create({
  timeout: 8000,
  headers: { "User-Agent": "QuickRide/1.0 (ride-hailing demo)" },
});

function describe(properties = {}) {
  const street = [properties.housenumber, properties.street].filter(Boolean).join(" ");
  const parts = [
    properties.name,
    street && street !== properties.name ? street : null,
    properties.district || properties.locality,
    properties.city || properties.county,
    properties.state,
    properties.country,
  ].filter(Boolean);
  return [...new Set(parts)].join(", ");
}

async function search(query, limit) {
  const { data } = await http.get(`${PHOTON_URL}/api/`, { params: { q: query, limit, lang: "en" } });
  return data.features || [];
}

const COORDINATES = /^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/;

async function getAddressCoordinate(address) {
  // Accept a raw "lat,lng" pair so a captain's live GPS fix can be routed without geocoding.
  const pair = COORDINATES.exec(address);
  if (pair && Math.abs(pair[1]) <= 90 && Math.abs(pair[2]) <= 180) {
    return { ltd: Number(pair[1]), lng: Number(pair[2]) };
  }
  const [feature] = await search(address, 1);
  if (!feature) throw new Error("Unable to fetch coordinates.");
  const [lng, ltd] = feature.geometry.coordinates;
  return { ltd, lng };
}

async function getAutoCompleteSuggestions(input) {
  const features = await search(input, 6);
  return [...new Set(features.map((f) => describe(f.properties)).filter(Boolean))];
}

async function reverseGeocode(lat, lng) {
  const { data } = await http.get(`${PHOTON_URL}/reverse`, { params: { lat, lon: lng, lang: "en" } });
  const feature = data.features?.[0];
  return feature ? describe(feature.properties) : null;
}

function formatDuration(seconds) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
}

// Mirrors the Google Distance Matrix element shape ride.service.js already consumes.
async function getRoute(origin, destination) {
  const [from, to] = await Promise.all([
    getAddressCoordinate(origin),
    getAddressCoordinate(destination),
  ]);
  const path = `${from.lng},${from.ltd};${to.lng},${to.ltd}`;
  const { data } = await http.get(`${OSRM_URL}/route/v1/driving/${path}`, {
    params: { overview: "full", geometries: "geojson" },
  });
  const route = data.routes?.[0];
  if (data.code !== "Ok" || !route) throw new Error("No routes found");
  return {
    status: "OK",
    distance: { value: Math.round(route.distance), text: `${(route.distance / 1000).toFixed(1)} km` },
    duration: { value: Math.round(route.duration), text: formatDuration(route.duration) },
    from,
    to,
    geometry: route.geometry,
  };
}

module.exports = { getAddressCoordinate, getAutoCompleteSuggestions, reverseGeocode, getRoute };
