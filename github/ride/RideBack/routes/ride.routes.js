const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const catchAsync = require("../utils/catchAsync");

const address = (field, label) =>
  query(field).isString().trim().isLength({ min: 3, max: 256 }).withMessage(`Invalid ${label} address`);
const rideId = body("rideId").isMongoId().withMessage("Invalid ride id");

module.exports = ({ rideCreationLimiter, verificationLimiter, mapLimiter }) => {
router.get("/chat-details/:id",
  authMiddleware.authAny,
  param("id").isMongoId(),
  validate,
  catchAsync(rideController.chatDetails)
);

router.post(
  "/create",
  authMiddleware.authUser,
  rideCreationLimiter,
  body("pickup").isString().trim().isLength({ min: 3, max: 256 }).withMessage("Invalid pickup address"),
  body("destination").isString().trim().isLength({ min: 3, max: 256 }).withMessage("Invalid destination address"),
  body("vehicleType").isString().isIn(["auto", "car", "bike"]).withMessage("Invalid vehicle type"),
  validate,
  catchAsync(rideController.createRide),
);

router.get(
  "/get-fare",
  authMiddleware.authUser,
  mapLimiter,
  address("pickup", "pickup"),
  address("destination", "destination"),
  validate,
  catchAsync(rideController.getFare),
);

// Public fare estimate for the landing page. Same maps limiter as the signed-in version.
router.get(
  "/get-visitor-fare",
  mapLimiter,
  address("pickup", "pickup"),
  address("destination", "destination"),
  validate,
  catchAsync(rideController.getFare),
);

// The ride the signed-in account is currently part of: lets the app rebuild its screen
// after a refresh, a crash or a sign-in on another device.
router.get("/active", authMiddleware.authAny, catchAsync(rideController.activeRide));

// Open requests near a captain who has just come online or reconnected.
router.get("/available", authMiddleware.authCaptain, catchAsync(rideController.availableRides));

// Public, read-only "follow my trip" feed. The token is the only credential.
router.get(
  "/track/:token",
  mapLimiter,
  param("token").isString().isLength({ min: 16, max: 64 }).matches(/^[A-Za-z0-9_-]+$/),
  validate,
  catchAsync(rideController.trackRide),
);

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  rideId,
  validate,
  catchAsync(rideController.confirmRide),
);

router.post(
  "/cancel",
  authMiddleware.authAny,
  rideId,
  body("reason").optional().isString().trim().isLength({ max: 120 }),
  validate,
  catchAsync(rideController.cancelRide),
);

router.post(
  "/start-ride",
  authMiddleware.authCaptain,
  verificationLimiter,
  rideId,
  body("otp").isString().matches(/^\d{6}$/).withMessage("Invalid OTP"),
  validate,
  catchAsync(rideController.startRide),
);

router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  rideId,
  validate,
  catchAsync(rideController.endRide),
);

router.post(
  "/rate",
  authMiddleware.authAny,
  rideId,
  body("stars").isInt({ min: 1, max: 5 }).toInt().withMessage("Choose a rating from 1 to 5"),
  body("comment").optional({ values: "falsy" }).isString().trim().isLength({ max: 280 }),
  validate,
  catchAsync(rideController.rateRide),
);

router.post(
  "/share",
  authMiddleware.authUser,
  rideId,
  validate,
  catchAsync(rideController.shareRide),
);

router.post(
  "/sos",
  authMiddleware.authAny,
  rideId,
  body("location.ltd").optional().isFloat({ min: -90, max: 90 }).toFloat(),
  body("location.lng").optional().isFloat({ min: -180, max: 180 }).toFloat(),
  validate,
  catchAsync(rideController.sos),
);

// Keep last: matches any single path segment.
router.get(
  "/:id",
  authMiddleware.authAny,
  param("id").isMongoId().withMessage("Invalid ride id"),
  validate,
  catchAsync(rideController.rideDetail),
);

return router;
};
