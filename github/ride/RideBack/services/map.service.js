const axios = require("axios");
const captainModel = require("../models/captain.model");
const osm = require("./osm.service");

// Google is used only when a key is configured; otherwise the keyless OSM provider runs.
const useGoogle = () => Boolean(process.env.GOOGLE_MAPS_API);

module.exports.getAddressCoordinate = async (address) => {
  if (!useGoogle()) {
    try {
      return await osm.getAddressCoordinate(address);
    } catch {
      throw new Error("Unable to fetch coordinates.");
    }
  }
  const apiKey = process.env.GOOGLE_MAPS_API;
  if (!apiKey) throw new Error("Maps integration is not configured.");
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url, { timeout: 5000 });
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        ltd: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    throw new Error("Unable to fetch coordinates.");
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }
  if (!useGoogle()) {
    try {
      // Includes from/to/geometry so the client can draw the route without a second lookup.
      return await osm.getRoute(origin, destination);
    } catch {
      throw new Error("Unable to fetch distance and time.");
    }
  }
  const apiKey = process.env.GOOGLE_MAPS_API;
  if (!apiKey) throw new Error("Maps integration is not configured.");

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url, { timeout: 5000 });
    if (response.data.status === "OK") {
      if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
        throw new Error("No routes found");
      }

      return response.data.rows[0].elements[0];
    } else {
      throw new Error("Unable to fetch distance and time");
    }
  } catch (err) {
    throw new Error("Unable to fetch distance and time.");
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }
  if (!useGoogle()) {
    try {
      return await osm.getAutoCompleteSuggestions(input);
    } catch {
      throw new Error("Unable to fetch suggestions.");
    }
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  if (!apiKey) throw new Error("Maps integration is not configured.");
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url, { timeout: 5000 });
    if (response.data.status === "OK") {
      return response.data.predictions
        .map((prediction) => prediction.description)
        .filter((value) => value);
    } else {
      throw new Error("Unable to fetch suggestions");
    }
  } catch (err) {
    throw new Error("Unable to fetch suggestions.");
  }
};

module.exports.getRoute = async (origin, destination) => {
  try {
    return await osm.getRoute(origin, destination);
  } catch {
    throw new Error("Unable to fetch route.");
  }
};

module.exports.reverseGeocode = async (lat, lng) => {
  try {
    return await osm.reverseGeocode(lat, lng);
  } catch {
    throw new Error("Unable to look up this location.");
  }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius, vehicleType) => {
  // radius in km

  try {
    const captains = await captainModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, ltd], radius / 6371],
        },
      },
      "vehicle.type": vehicleType,
      socketId: { $exists: true, $ne: "" },
    })
      .select("_id socketId fullname vehicle location status")
      .limit(100)
      .lean();
    return captains;
  } catch (error) {
    throw new Error("Unable to find nearby drivers.");
  }
};
