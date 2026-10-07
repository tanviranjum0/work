const captainModel = require("../models/captain.model");
const google = require("./google.service");
const logger = require("../utils/logger");
const { AppError, BadRequestError } = require("../utils/AppError");

// Every map lookup goes to Google Maps Platform. Errors the client can act on (unknown
// place, no route) keep their own code; everything else becomes one MAPS_UNAVAILABLE 502
// and the underlying reason is logged without ever exposing the key.
async function guard(operation, run) {
  try {
    return await run();
  } catch (error) {
    if (error instanceof AppError && error.statusCode < 500) throw error;
    logger.error("Google Maps request failed", { operation, detail: google.describeError(error) });
    if (error instanceof AppError) throw error;
    throw new AppError("Maps are temporarily unavailable. Please try again in a moment.", 502, "MAPS_UNAVAILABLE");
  }
}

module.exports.getAddressCoordinate = (address) =>
  guard("geocode", () => google.getAddressCoordinate(address));

module.exports.getDistanceTime = (origin, destination) => {
  if (!origin || !destination) {
    throw new BadRequestError("Origin and destination are required.");
  }
  return guard("route", () => google.getRoute(origin, destination));
};

module.exports.getAutoCompleteSuggestions = (input) => {
  if (!input) throw new BadRequestError("Enter a place to search for.");
  return guard("autocomplete", () => google.getAutoCompleteSuggestions(input));
};

module.exports.getRoute = (origin, destination) =>
  guard("route", () => google.getRoute(origin, destination));

module.exports.reverseGeocode = (lat, lng) =>
  guard("reverse-geocode", () => google.reverseGeocode(lat, lng));

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius, vehicleType) => {
  // radius in km
  try {
    return await captainModel
      .find({
        location: {
          $geoWithin: {
            $centerSphere: [[lng, ltd], radius / 6371],
          },
        },
        "vehicle.type": vehicleType,
        // Only drivers who are online and have a live socket can receive an offer.
        status: "active",
        registrationStatus: { $ne: "pending_2fa" },
        socketId: { $exists: true, $ne: "" },
      })
      .select("_id socketId fullname vehicle location status")
      .limit(100)
      .lean();
  } catch (error) {
    throw new AppError("Unable to find nearby drivers.", 503, "DISPATCH_UNAVAILABLE");
  }
};
