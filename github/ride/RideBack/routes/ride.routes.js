const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const catchAsync = require("../utils/catchAsync");

module.exports = ({ rideCreationLimiter, verificationLimiter }) => {
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
  body("pickup")
    .isString()
    .trim().isLength({ min: 3, max: 256 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .trim().isLength({ min: 3, max: 256 })
    .withMessage("Invalid destination address"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "bike"])
    .withMessage("Invalid vehicle type"),
  validate,
  catchAsync(rideController.createRide),
);

router.get(
  "/get-fare",
  authMiddleware.authUser,
  query("pickup")
    .isString()
    .trim().isLength({ min: 3, max: 256 })
    .withMessage("Invalid pickup address"),
  query("destination")
    .isString()
    .trim().isLength({ min: 3, max: 256 })
    .withMessage("Invalid destination address"),
  validate,
  catchAsync(rideController.getFare),
);
router.get(
  "/get-visitor-fare",
  query("pickup")
    .isString()
    .trim().isLength({ min: 3, max: 256 })
    .withMessage("Invalid pickup address"),
  query("destination")
    .isString()
    .trim().isLength({ min: 3, max: 256 })
    .withMessage("Invalid destination address"),
  validate,
  catchAsync(rideController.getFare),
);

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  validate,
  catchAsync(rideController.confirmRide),
);

router.post(
  "/cancel",
  authMiddleware.authAny,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  validate,
  catchAsync(rideController.cancelRide),
);

router.post(
  "/start-ride",
  authMiddleware.authCaptain,
  verificationLimiter,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  body("otp")
    .isString()
    .matches(/^\d{6}$/)
    .withMessage("Invalid OTP"),
  validate,
  catchAsync(rideController.startRide),
);

router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  validate,
  catchAsync(rideController.endRide),
);

return router;
};
