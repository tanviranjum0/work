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

module.exports.getAutoCompleteSuggestionsForVisitors = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { input } = req.query;

  const suggestions = await mapService.getAutoCompleteSuggestions(input);

  return res.status(200).json(suggestions);
};
