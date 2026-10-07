const captainModel = require("../models/captain.model");
const google = require("./google.service");

// Every map lookup goes to Google Maps Platform; failures are normalised to stable messages.
module.exports.getAddressCoordinate = async (address) => {
  try {
    return await google.getAddressCoordinate(address);
  } catch {
    throw new Error("Unable to fetch coordinates.");
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }
  try {
    return await google.getRoute(origin, destination);
  } catch {
    throw new Error("Unable to fetch distance and time.");
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }
  try {
    return await google.getAutoCompleteSuggestions(input);
  } catch {
    throw new Error("Unable to fetch suggestions.");
  }
};

module.exports.getRoute = async (origin, destination) => {
  try {
    return await google.getRoute(origin, destination);
  } catch {
    throw new Error("Unable to fetch route.");
  }
};

module.exports.reverseGeocode = async (lat, lng) => {
  try {
    return await google.reverseGeocode(lat, lng);
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
