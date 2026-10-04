const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");
const userModel = require("../models/user.model");
const logger = require("../utils/logger");
const { enqueueRideDispatch, dispatchRide } = require("../services/jobQueue.service");

module.exports.chatDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const ride = await rideModel
      .findOne({ _id: id })
      .populate("user", "socketId fullname phone")
      .populate("captain", "socketId fullname phone");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    const authorized =
      (req.userType === "user" && ride.user?._id?.toString() === req.authUserId.toString()) ||
      (req.userType === "captain" && ride.captain?._id?.toString() === req.authUserId.toString());
    if (!authorized) {
      return res.status(403).json({ message: "You are not a participant in this ride." });
    }

    const response = {
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
    };

    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const { ride, otp } = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    await userModel.updateOne(
      { _id: req.user._id },
      { $addToSet: { rides: ride._id } },
    );

    const publicRide = { ...ride.toObject(), otp };
    delete publicRide.otpHash;
    delete publicRide.otp;
    res.status(201).json(publicRide);

    if (!(await enqueueRideDispatch(ride._id))) {
      setImmediate(() => {
        dispatchRide(ride._id).catch(() => {
          logger.warn("Ride dispatch task failed", { rideId: ride._id.toString() });
        });
      });
    }
  } catch (err) {
    throw err;
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const { fare, distanceTime } = await rideService.getFare(
      pickup,
      destination,
    );
    return res.status(200).json({ fare, distanceTime });
  } catch (err) {
    throw err;
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const rideDetails = await rideModel.findOne({ _id: rideId });

    if (!rideDetails) {
      return res.status(404).json({ message: "Ride not found." });
    }

    switch (rideDetails.status) {
      case "accepted":
        return res.status(400).json({
          message:
            "The ride is accepted by another captain before you. Better luck next time.",
        });

      case "ongoing":
        return res.status(400).json({
          message: "The ride is currently ongoing with another captain.",
        });

      case "completed":
        return res
          .status(400)
          .json({ message: "The ride has already been completed." });

      case "cancelled":
        return res
          .status(400)
          .json({ message: "The ride has been cancelled." });

      default:
        break;
    }

    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    throw err;
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.body;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    throw err;
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    throw err;
  }
};

module.exports.cancelRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ownership = req.userType === "user"
      ? { user: req.authUserId }
      : { captain: req.authUserId };
    const ride = await rideModel.findOneAndUpdate(
      { _id: rideId, ...ownership, status: { $in: ["pending", "accepted"] } },
      {
        status: "cancelled",
      },
      { new: true },
    ).populate({
      path: "user",
      select: "fullname phone socketId",
    }).populate({
      path: "captain",
      select: "fullname phone socketId vehicle",
    });
    if (!ride) {
      return res.status(404).json({ message: "Ride not found or cannot be cancelled." });
    }

    for (const participant of [ride.user, ride.captain]) {
      if (participant?.socketId) sendMessageToSocketId(participant.socketId, {
        event: "ride-cancelled",
        data: ride,
      });
    }
    return res.status(200).json(ride);
  } catch (err) {
    throw err;
  }
};
