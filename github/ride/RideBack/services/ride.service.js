const captainModel = require("../models/captain.model");
const rideModel = require("../models/ride.model");
const mapService = require("./map.service");
const crypto = require("crypto");
const { AppError, BadRequestError, ForbiddenError, NotFoundError, ConflictError } = require("../utils/AppError");

function roundTo(num, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

const getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  const baseFare = {
    auto: 50 / 100,
    car: 80 / 100,
    bike: 20 / 100,
  };

  const perKmRate = {
    auto: 50 / 100,
    car: 80 / 100,
    bike: 20 / 100,
  };

  const perMinuteRate = {
    auto: 5 / 100,
    car: 10 / 100,
    bike: 2.5 / 100,
  };

  const fare = {
    auto: roundTo(
      baseFare.auto +
        (distanceTime.distance.value / 1000) * perKmRate.auto +
        (distanceTime.duration.value / 60) * perMinuteRate.auto,

      2,
    ),
    car: roundTo(
      baseFare.car +
        (distanceTime.distance.value / 1000) * perKmRate.car +
        (distanceTime.duration.value / 60) * perMinuteRate.car,

      2,
    ),
    bike: roundTo(
      baseFare.bike +
        (distanceTime.distance.value / 1000) * perKmRate.bike +
        (distanceTime.duration.value / 60) * perMinuteRate.bike,

      2,
    ),
  };

  return { fare, distanceTime };
};

module.exports.getFare = getFare;

function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp(num);
}

function hashOtp(otp) {
  const secret = process.env.OTP_HASH_SECRET || process.env.JWT_SECRET;
  return crypto.createHmac("sha256", secret).update(otp).digest("hex");
}

module.exports.hashOtp = hashOtp;

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  try {
    const { fare, distanceTime } = await getFare(pickup, destination);

    const otp = getOtp(6);
    const ride = await rideModel.create({
      user,
      pickup,
      destination,
      otpHash: hashOtp(otp),
      fare: fare[vehicleType],
      vehicle: vehicleType,
      distance: distanceTime.distance.value,
      duration: distanceTime.duration.value,
    });

    return { ride, otp };
  } catch (error) {
    throw new AppError("Unable to create ride.", 500, "RIDE_CREATE_FAILED");
  }
};

// when ride request is accepted by captain
module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new BadRequestError("Ride id is required.");
  }
  if (!captain.emailVerified) {
    throw new ForbiddenError("Verify your email before accepting rides.", "EMAIL_NOT_VERIFIED");
  }

  try {
    const acceptedRide = await rideModel.findOneAndUpdate(
      {
        _id: rideId,
        status: "pending",
        // Keeps a car ride off a bike's queue and vice versa; a mismatch just leaves the
        // ride pending for another captain instead of letting any vehicle type take it.
        vehicle: captain.vehicle?.type,
      },
      {
        status: "accepted",
        captain: captain._id,
      },
      { new: true },
    );
    if (!acceptedRide) throw new ConflictError("Ride is no longer available.", "RIDE_UNAVAILABLE");

    await captainModel.updateOne(
      { _id: captain._id },
      { $addToSet: { rides: rideId } },
    );

    const ride = await rideModel
      .findById(rideId)
      .populate("user", "fullname phone socketId")
      .populate("captain", "fullname phone socketId vehicle");

    if (!ride) throw new NotFoundError("Ride not found.");

    return ride;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Unable to confirm ride.", 500, "RIDE_CONFIRM_FAILED");
  }
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new BadRequestError("Ride id and OTP are required.");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
      status: "accepted",
    })
    .populate("user", "fullname phone socketId")
    .populate("captain", "fullname phone socketId vehicle")
    .select("+otpHash +otp");

  if (!ride) {
    throw new NotFoundError("Ride not found.");
  }

  if (ride.status !== "accepted") {
    throw new ConflictError("Ride is not ready to start.", "RIDE_NOT_ACCEPTED");
  }

  const submittedHash = hashOtp(otp);
  const storedHash = ride.otpHash && Buffer.from(ride.otpHash, "hex");
  const submittedHashBuffer = Buffer.from(submittedHash, "hex");
  const otpMatches = storedHash
    ? storedHash.length === submittedHashBuffer.length &&
      crypto.timingSafeEqual(storedHash, submittedHashBuffer)
    : ride.otp === otp;
  if (!otpMatches) {
    throw new BadRequestError("Invalid OTP.", "INVALID_OTP");
  }

  const otpFilter = ride.otpHash ? { otpHash: submittedHash } : { otp };
  const updatedRide = await rideModel.findOneAndUpdate(
    {
      _id: rideId,
      captain: captain._id,
      status: "accepted",
      ...otpFilter,
    },
    {
      status: "ongoing",
    },
    { new: true },
  ).populate({
    path: "user",
    select: "fullname phone socketId",
  }).populate({
    path: "captain",
    select: "fullname phone socketId vehicle",
  });

  if (!updatedRide) throw new ConflictError("Ride status changed before it could be started.", "RIDE_STATE_CONFLICT");
  return updatedRide;
};

module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new BadRequestError("Ride id is required.");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
    })
    .populate("user", "fullname phone socketId")
    .populate("captain", "fullname phone socketId vehicle");

  if (!ride) {
    throw new NotFoundError("Ride not found.");
  }

  if (ride.status !== "ongoing") {
    throw new ConflictError("Ride is not ongoing.", "RIDE_NOT_ONGOING");
  }

  const updatedRide = await rideModel.findOneAndUpdate(
    {
      _id: rideId,
      captain: captain._id,
      status: "ongoing",
    },
    {
      status: "completed",
    },
    { new: true },
  ).populate({
    path: "user",
    select: "fullname phone socketId",
  }).populate({
    path: "captain",
    select: "fullname phone socketId vehicle",
  });

  if (!updatedRide) throw new ConflictError("Ride status changed before it could be completed.", "RIDE_STATE_CONFLICT");
  return updatedRide;
};
