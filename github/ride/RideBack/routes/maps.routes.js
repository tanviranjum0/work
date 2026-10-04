const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const mapController = require("../controllers/map.controller");
const { query } = require("express-validator");
const validate = require("../middlewares/validate.middleware");
const catchAsync = require("../utils/catchAsync");

router.get(
  "/get-coordinates",
  query("address").isString().trim().isLength({ min: 3, max: 256 }),
  validate,
  // authMiddleware.authUser,
  catchAsync(mapController.getCoordinates),
);

router.get(
  "/get-distance-time",
  query("origin").isString().trim().isLength({ min: 3, max: 256 }),
  query("destination").isString().trim().isLength({ min: 3, max: 256 }),
  validate,
  authMiddleware.authUser,
  catchAsync(mapController.getDistanceTime),
);

router.get(
  "/get-suggestions",
  query("input").isString().trim().isLength({ min: 3, max: 256 }),
  validate,
  authMiddleware.authUser,
  catchAsync(mapController.getAutoCompleteSuggestions),
);
router.get(
  "/get-visitor-suggestions",
  query("input").isString().trim().isLength({ min: 3, max: 256 }),
  validate,
  catchAsync(mapController.getAutoCompleteSuggestionsForVisitors),
);

module.exports = router;
