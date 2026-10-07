const rideService = require("../services/ride.service");
const { sendToAccount, joinRideRoom, closeRideRoom } = require("../socket");
const rideModel = require("../models/ride.model");
const userModel = require("../models/user.model");
const logger = require("../utils/logger");
const { NotFoundError, ForbiddenError } = require("../utils/AppError");
const { enqueueRideDispatch, dispatchRide } = require("../services/jobQueue.service");

const { toClientRide } = rideService;

module.exports.chatDetails = async (req, res) => {
  const { id } = req.params;
  const ride = await rideModel
    .findOne({ _id: id })
    .populate("user", "socketId fullname phone")
    .populate("captain", "socketId fullname phone");

  if (!ride) throw new NotFoundError("Ride not found.");
  const authorized =
    (req.userType === "user" && ride.user?._id?.toString() === req.authUserId.toString()) ||
    (req.userType === "captain" && ride.captain?._id?.toString() === req.authUserId.toString());
  if (!authorized) throw new ForbiddenError("You are not a participant in this ride.", "NOT_A_PARTICIPANT");

  res.status(200).json({
    user: {
      socketId: ride.user?.socketId,
      fullname: ride.user?.fullname,
      phone: ride.user?.phone,
      _id: ride.user?._id,
    },
    captain: {
      socketId: ride.captain?.socketId,
      fullname: ride.captain?.fullname,
      phone: ride.captain?.phone,
      _id: ride.captain?._id,
    },
    messages: ride.messages,
  });
};

module.exports.createRide = async (req, res) => {
  const { pickup, destination, vehicleType } = req.body;

  const { ride, otp } = await rideService.createRide({
    user: req.user._id,
    pickup,
    destination,
    vehicleType,
  });

  await userModel.updateOne({ _id: req.user._id }, { $addToSet: { rides: ride._id } });

  res.status(201).json({ ...toClientRide(ride, "user"), otp });

  if (!(await enqueueRideDispatch(ride._id))) {
    setImmediate(() => {
      dispatchRide(ride._id).catch(() => {
        logger.warn("Ride dispatch task failed", { rideId: ride._id.toString() });
      });
    });
  }
};

module.exports.getFare = async (req, res) => {
  const { pickup, destination } = req.query;
  const { fare, distanceTime } = await rideService.getFare(pickup, destination);
  return res.status(200).json({ fare, distanceTime });
};

module.exports.activeRide = async (req, res) => {
  const ride = await rideService.getActiveRide({ accountId: req.authUserId, type: req.userType });
  return res.status(200).json({ ride });
};

module.exports.availableRides = async (req, res) => {
  const rides = await rideService.listAvailableRides({ captain: req.captain });
  return res.status(200).json({ rides });
};

module.exports.rideDetail = async (req, res) => {
  const ride = await rideService.getRideDetail({
    rideId: req.params.id,
    accountId: req.authUserId,
    type: req.userType,
  });
  return res.status(200).json({ ride });
};

module.exports.confirmRide = async (req, res) => {
  const { rideId } = req.body;

  const current = await rideModel.findOne({ _id: rideId }).select("status");
  if (!current) throw new NotFoundError("Ride not found.");
  const unavailable = {
    accepted: "Another driver already accepted this ride.",
    ongoing: "This ride is already in progress with another driver.",
    completed: "This ride has already been completed.",
    cancelled: "The rider cancelled this request.",
  }[current.status];
  if (unavailable) {
    const { ConflictError } = require("../utils/AppError");
    throw new ConflictError(unavailable, "RIDE_UNAVAILABLE");
  }

  const ride = await rideService.confirmRide({ rideId, captain: req.captain });

  joinRideRoom(ride._id, { userId: ride.user._id, captainId: ride.captain._id });
  sendToAccount("user", ride.user._id, "ride-confirmed", toClientRide(ride, "user"));
  return res.status(200).json(toClientRide(ride, "captain"));
};

module.exports.startRide = async (req, res) => {
  const { rideId, otp } = req.body;
  const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

  sendToAccount("user", ride.user._id, "ride-started", toClientRide(ride, "user"));
  return res.status(200).json(toClientRide(ride, "captain"));
};

module.exports.endRide = async (req, res) => {
  const { rideId } = req.body;
  const ride = await rideService.endRide({ rideId, captain: req.captain });

  sendToAccount("user", ride.user._id, "ride-ended", toClientRide(ride, "user"));
  closeRideRoom(ride._id);
  return res.status(200).json(toClientRide(ride, "captain"));
};

module.exports.cancelRide = async (req, res) => {
  const { rideId, reason } = req.body;
  const ride = await rideService.cancelRide({
    rideId,
    accountId: req.authUserId,
    type: req.userType,
    reason,
  });

  closeRideRoom(ride._id);
  // Tell the other side so their screen resets straight away.
  const counterpart = req.userType === "user" ? ride.captain : ride.user;
  const counterpartType = req.userType === "user" ? "captain" : "user";
  if (counterpart?._id) {
    sendToAccount(counterpartType, counterpart._id, "ride-cancelled", {
      rideId: ride._id,
      cancelledBy: req.userType,
      reason: ride.cancelReason,
    });
  }
  return res.status(200).json({ ride: toClientRide(ride, req.userType) });
};

module.exports.rateRide = async (req, res) => {
  const { rideId, stars, comment } = req.body;
  const rating = await rideService.rateRide({
    rideId,
    accountId: req.authUserId,
    type: req.userType,
    stars,
    comment,
  });
  return res.status(201).json({ message: "Thanks for your feedback", rating });
};

module.exports.shareRide = async (req, res) => {
  const token = await rideService.shareRide({ rideId: req.body.rideId, userId: req.authUserId });
  const base = (process.env.CLIENT_URL || "").replace(/\/$/, "");
  return res.status(200).json({ token, url: `${base}/track/${token}` });
};

module.exports.trackRide = async (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.status(200).json(await rideService.trackByToken(req.params.token));
};

module.exports.sos = async (req, res) => {
  const { rideId, location } = req.body;
  const ride = await rideService.recordSos({
    rideId,
    accountId: req.authUserId,
    type: req.userType,
    location,
  });
  logger.warn("SOS raised", { rideId: ride._id.toString(), by: req.userType });
  const counterpart = req.userType === "user" ? ride.captain : ride.user;
  const counterpartType = req.userType === "user" ? "captain" : "user";
  if (counterpart?._id) {
    sendToAccount(counterpartType, counterpart._id, "ride-sos", { rideId: ride._id, by: req.userType });
  }
  return res.status(200).json({ message: "Safety alert recorded", emergencyNumber: process.env.EMERGENCY_NUMBER || "112" });
};
