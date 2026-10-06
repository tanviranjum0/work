const mapService = require("../services/map.service");
const { validationResult } = require("express-validator");

module.exports.getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  const coordinates = await mapService.getAddressCoordinate(address);
  return res.status(200).json(coordinates);
};

module.exports.getDistanceTime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination } = req.query;

  const distanceTime = await mapService.getDistanceTime(origin, destination);

  return res.status(200).json(distanceTime);
};

module.exports.getAutoCompleteSuggestions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { input } = req.query;

  const suggestions = await mapService.getAutoCompleteSuggestions(input);

  return res.status(200).json(suggestions);
};

module.exports.getRoute = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { origin, destination } = req.query;
  return res.status(200).json(await mapService.getRoute(origin, destination));
};

module.exports.reverseGeocode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const address = await mapService.reverseGeocode(Number(req.query.lat), Number(req.query.lng));
  return res.status(200).json({ address });
};

module.exports.getAutoCompleteSuggestionsForVisitors = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { input } = req.query;

  const suggestions = await mapService.getAutoCompleteSuggestions(input);

  return res.status(200).json(suggestions);
};
