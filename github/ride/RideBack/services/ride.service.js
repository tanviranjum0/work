const mongoose = require("mongoose");
const crypto = require("crypto");
const captainModel = require("../models/captain.model");
const userModel = require("../models/user.model");
const rideModel = require("../models/ride.model");
const mapService = require("./map.service");
const {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/AppError");

const ACTIVE_STATUSES = ["pending", "accepted", "ongoing"];
// A request nobody accepts in this long is cancelled automatically, even if the rider closed the app.
const REQUEST_TTL_MS = 150 * 1000;
const SHARE_LINK_TTL_MS = 24 * 60 * 60 * 1000;

function roundTo(num, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

const getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new BadRequestError("Pickup and destination are required.");
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

  const price = (type) =>
    roundTo(
      baseFare[type] +
        (distanceTime.distance.value / 1000) * perKmRate[type] +
        (distanceTime.duration.value / 60) * perMinuteRate[type],
      2,
    );

  return {
    fare: { auto: price("auto"), car: price("car"), bike: price("bike") },
    distanceTime,
  };
};

module.exports.getFare = getFare;

function otpSecret() {
  return process.env.OTP_HASH_SECRET || process.env.JWT_SECRET;
}

// The pickup code is derived from the ride id, so the rider can always be shown it again
// (after a refresh or on another device) without ever storing it in plain text.
function deriveOtp(rideId) {
  const digest = crypto.createHmac("sha256", otpSecret()).update(`ride-otp:${rideId}`).digest("hex");
  return String(100000 + (parseInt(digest.slice(0, 12), 16) % 900000));
}

function hashOtp(otp) {
  return crypto.createHmac("sha256", otpSecret()).update(otp).digest("hex");
}

module.exports.hashOtp = hashOtp;
module.exports.deriveOtp = deriveOtp;

const point = (location) =>
  location?.coordinates?.length === 2
    ? { ltd: location.coordinates[1], lng: location.coordinates[0] }
    : null;

const nameOf = (person) => ({
  firstname: person?.fullname?.firstname,
  lastname: person?.fullname?.lastname,
});

// Shapes a ride for one participant. The counterpart's phone number is only revealed once
// a captain has accepted, and the pickup code is only ever sent to the rider.
function toClientRide(ride, viewer) {
  const raw = ride.toObject ? ride.toObject() : ride;
  const matched = ["accepted", "ongoing", "completed"].includes(raw.status);
  const out = {
    _id: raw._id,
    status: raw.status,
    pickup: raw.pickup,
    destination: raw.destination,
    pickupCoordinates: raw.pickupCoordinates,
    destinationCoordinates: raw.destinationCoordinates,
    fare: raw.fare,
    vehicle: raw.vehicle,
    distance: raw.distance,
    duration: raw.duration,
    paymentMethod: raw.paymentMethod,
    createdAt: raw.createdAt,
    acceptedAt: raw.acceptedAt,
    startedAt: raw.startedAt,
    completedAt: raw.completedAt,
    cancelledAt: raw.cancelledAt,
    cancelledBy: raw.cancelledBy,
    cancelReason: raw.cancelReason,
    rating: raw.rating,
    sos: raw.sos?.at ? { at: raw.sos.at, by: raw.sos.by } : undefined,
    user: raw.user && {
      _id: raw.user._id || raw.user,
      fullname: raw.user.fullname,
      rating: raw.user.rating,
      ...(viewer === "captain" && matched && { phone: raw.user.phone }),
    },
    captain: raw.captain && {
      _id: raw.captain._id || raw.captain,
      fullname: raw.captain.fullname,
      vehicle: raw.captain.vehicle,
      rating: raw.captain.rating,
      location: point(raw.captain.location),
      ...(viewer === "user" && matched && { phone: raw.captain.phone }),
    },
  };
  if (raw.status === "pending") {
    out.expiresAt = new Date(new Date(raw.createdAt).getTime() + REQUEST_TTL_MS);
  }
  if (viewer === "user" && ["pending", "accepted"].includes(raw.status) && raw.otpHash) {
    const otp = deriveOtp(raw._id);
    if (hashOtp(otp) === raw.otpHash) out.otp = otp;
  }
  return out;
}
module.exports.toClientRide = toClientRide;

const populateParticipants = (query) =>
  query
    .populate("user", "fullname phone rating")
    .populate("captain", "fullname phone vehicle rating location");

module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new BadRequestError("Pickup, destination and vehicle type are required.");
  }

  const existing = await rideModel.findOne({ user, status: { $in: ACTIVE_STATUSES } }).select("_id");
  if (existing) {
    throw new ConflictError("You already have a ride in progress.", "ACTIVE_RIDE_EXISTS");
  }

  const { fare, distanceTime } = await getFare(pickup, destination);
  if (distanceTime.distance.value < 100) {
    throw new BadRequestError("Pickup and destination are too close together.", "TRIP_TOO_SHORT");
  }

  try {
    const _id = new mongoose.Types.ObjectId();
    const otp = deriveOtp(_id);
    const ride = await rideModel.create({
      _id,
      user,
      pickup,
      destination,
      pickupCoordinates: distanceTime.from,
      destinationCoordinates: distanceTime.to,
      otpHash: hashOtp(otp),
      fare: fare[vehicleType],
      vehicle: vehicleType,
      distance: distanceTime.distance.value,
      duration: distanceTime.duration.value,
    });
    return { ride, otp };
  } catch (error) {
    throw new AppError("We could not create your ride. Please try again.", 500, "RIDE_CREATE_FAILED");
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
  const busy = await rideModel.exists({ captain: captain._id, status: { $in: ["accepted", "ongoing"] } });
  if (busy) {
    throw new ConflictError("Finish your current ride before accepting another.", "ACTIVE_RIDE_EXISTS");
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
        acceptedAt: new Date(),
      },
      { new: true },
    );
    if (!acceptedRide) throw new ConflictError("Ride is no longer available.", "RIDE_UNAVAILABLE");

    await captainModel.updateOne(
      { _id: captain._id },
      { $addToSet: { rides: rideId } },
    );

    const ride = await populateParticipants(rideModel.findById(rideId)).select("+otpHash");
    if (!ride) throw new NotFoundError("Ride not found.");
    return ride;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("We could not confirm this ride. Please try again.", 500, "RIDE_CONFIRM_FAILED");
  }
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new BadRequestError("Ride id and OTP are required.");
  }

  const ride = await populateParticipants(
    rideModel.findOne({ _id: rideId, captain: captain._id, status: "accepted" }),
  ).select("+otpHash +otp");

  if (!ride) {
    throw new NotFoundError("Ride not found.");
  }

  const submittedHash = hashOtp(otp);
  const storedHash = ride.otpHash && Buffer.from(ride.otpHash, "hex");
  const submittedHashBuffer = Buffer.from(submittedHash, "hex");
  const otpMatches = storedHash
    ? storedHash.length === submittedHashBuffer.length &&
      crypto.timingSafeEqual(storedHash, submittedHashBuffer)
    : ride.otp === otp;
  if (!otpMatches) {
    throw new BadRequestError("That pickup code is not right. Ask the rider to check their app.", "INVALID_OTP");
  }

  const otpFilter = ride.otpHash ? { otpHash: submittedHash } : { otp };
  const updatedRide = await populateParticipants(
    rideModel.findOneAndUpdate(
      { _id: rideId, captain: captain._id, status: "accepted", ...otpFilter },
      { status: "ongoing", startedAt: new Date() },
      { new: true },
    ),
  );

  if (!updatedRide) throw new ConflictError("Ride status changed before it could be started.", "RIDE_STATE_CONFLICT");
  return updatedRide;
};

module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new BadRequestError("Ride id is required.");
  }

  const ride = await rideModel.findOne({ _id: rideId, captain: captain._id }).select("status");
  if (!ride) {
    throw new NotFoundError("Ride not found.");
  }
  if (ride.status !== "ongoing") {
    throw new ConflictError("This ride is not in progress.", "RIDE_NOT_ONGOING");
  }

  const updatedRide = await populateParticipants(
    rideModel.findOneAndUpdate(
      { _id: rideId, captain: captain._id, status: "ongoing" },
      { status: "completed", completedAt: new Date() },
      { new: true },
    ),
  );

  if (!updatedRide) throw new ConflictError("Ride status changed before it could be completed.", "RIDE_STATE_CONFLICT");
  return updatedRide;
};

module.exports.cancelRide = async ({ rideId, accountId, type, reason, by }) => {
  const ownership = type === "user" ? { user: accountId } : { captain: accountId };
  const ride = await populateParticipants(
    rideModel.findOneAndUpdate(
      { _id: rideId, ...ownership, status: { $in: ["pending", "accepted"] } },
      {
        status: "cancelled",
        cancelledAt: new Date(),
        cancelledBy: by || type,
        ...(reason && { cancelReason: reason }),
      },
      { new: true },
    ),
  );
  if (ride) return ride;

  const current = await rideModel.findOne({ _id: rideId, ...ownership }).select("status");
  if (!current) throw new NotFoundError("Ride not found.");
  if (current.status === "ongoing") {
    throw new ConflictError(
      "A ride that has started cannot be cancelled. Use the safety button if you need help.",
      "RIDE_IN_PROGRESS",
    );
  }
  throw new ConflictError(`This ride is already ${current.status}.`, "RIDE_STATE_CONFLICT");
};

// Cancels pending requests that outlived the matching window.
async function expireStaleRequests(filter = {}) {
  const cutoff = new Date(Date.now() - REQUEST_TTL_MS);
  const stale = await rideModel
    .find({ ...filter, status: "pending", createdAt: { $lt: cutoff } })
    .select("_id")
    .lean();
  if (!stale.length) return [];
  await rideModel.updateMany(
    { _id: { $in: stale.map((ride) => ride._id) }, status: "pending" },
    { status: "cancelled", cancelledAt: new Date(), cancelledBy: "system", cancelReason: "no_drivers" },
  );
  return stale.map((ride) => ride._id);
}
module.exports.expireStaleRequests = expireStaleRequests;
module.exports.REQUEST_TTL_MS = REQUEST_TTL_MS;

module.exports.getActiveRide = async ({ accountId, type }) => {
  const filter = type === "user" ? { user: accountId } : { captain: accountId };
  await expireStaleRequests(filter);
  const ride = await populateParticipants(
    rideModel.findOne({ ...filter, status: { $in: ACTIVE_STATUSES } }).sort({ createdAt: -1 }),
  ).select("+otpHash");
  return ride ? toClientRide(ride, type) : null;
};

module.exports.getRideDetail = async ({ rideId, accountId, type }) => {
  const ownership = type === "user" ? { user: accountId } : { captain: accountId };
  const ride = await populateParticipants(rideModel.findOne({ _id: rideId, ...ownership })).select("+otpHash");
  if (!ride) throw new NotFoundError("Ride not found.");
  return toClientRide(ride, type);
};

module.exports.rateRide = async ({ rideId, accountId, type, stars, comment }) => {
  const ownership = type === "user" ? { user: accountId } : { captain: accountId };
  const ride = await rideModel.findOne({ _id: rideId, ...ownership });
  if (!ride) throw new NotFoundError("Ride not found.");
  if (ride.status !== "completed") {
    throw new ConflictError("You can rate a ride once it has finished.", "RIDE_NOT_COMPLETED");
  }
  const slot = type === "user" ? "byUser" : "byCaptain";
  if (ride.rating?.[slot]?.stars) {
    throw new ConflictError("You have already rated this ride.", "ALREADY_RATED");
  }

  ride.set(`rating.${slot}`, { stars, ...(comment && { comment }), at: new Date() });
  await ride.save();

  // The rider rates the captain and vice versa; keep a running average on the rated account.
  const Target = type === "user" ? captainModel : userModel;
  const targetId = type === "user" ? ride.captain : ride.user;
  const target = await Target.findById(targetId).select("rating");
  if (target) {
    const count = (target.rating?.count || 0) + 1;
    const avg = ((target.rating?.avg || 0) * (count - 1) + stars) / count;
    target.rating = { avg: Math.round(avg * 100) / 100, count };
    await target.save();
  }
  return { stars, comment };
};

module.exports.shareRide = async ({ rideId, userId }) => {
  const ride = await rideModel.findOne({ _id: rideId, user: userId }).select("+shareToken status");
  if (!ride) throw new NotFoundError("Ride not found.");
  if (!["accepted", "ongoing"].includes(ride.status)) {
    throw new ConflictError("You can share a trip once a driver has accepted it.", "RIDE_NOT_SHAREABLE");
  }
  if (!ride.shareToken) {
    ride.shareToken = crypto.randomBytes(18).toString("base64url");
    await ride.save();
  }
  return ride.shareToken;
};

// Public, read-only view for the "follow my trip" link. Exposes only what a friend needs.
module.exports.trackByToken = async (token) => {
  const ride = await rideModel
    .findOne({ shareToken: token })
    .select("+shareToken status pickup destination pickupCoordinates destinationCoordinates user captain updatedAt createdAt completedAt")
    .populate("user", "fullname")
    .populate("captain", "fullname vehicle location");
  const age = ride ? Date.now() - new Date(ride.createdAt).getTime() : Infinity;
  if (!ride || age > SHARE_LINK_TTL_MS) {
    throw new NotFoundError("This trip link is no longer available.", "TRIP_LINK_EXPIRED");
  }
  const live = ["accepted", "ongoing"].includes(ride.status);
  return {
    status: ride.status,
    pickup: ride.pickup,
    destination: ride.destination,
    pickupCoordinates: ride.pickupCoordinates,
    destinationCoordinates: ride.destinationCoordinates,
    rider: { firstname: ride.user?.fullname?.firstname },
    captain: ride.captain && {
      firstname: ride.captain.fullname?.firstname,
      vehicle: ride.captain.vehicle && {
        type: ride.captain.vehicle.type,
        color: ride.captain.vehicle.color,
        number: ride.captain.vehicle.number,
      },
      location: live ? point(ride.captain.location) : null,
    },
    updatedAt: ride.updatedAt,
  };
};

module.exports.recordSos = async ({ rideId, accountId, type, location }) => {
  const ownership = type === "user" ? { user: accountId } : { captain: accountId };
  const ride = await populateParticipants(
    rideModel.findOneAndUpdate(
      { _id: rideId, ...ownership, status: { $in: ["accepted", "ongoing"] } },
      { sos: { at: new Date(), by: type, ...(location && { location }) } },
      { new: true },
    ),
  );
  if (!ride) throw new NotFoundError("There is no active ride to report.", "NO_ACTIVE_RIDE");
  return ride;
};

const toRadians = (degrees) => (degrees * Math.PI) / 180;
function distanceKm(a, b) {
  const dLat = toRadians(b.ltd - a.ltd);
  const dLng = toRadians(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.ltd)) * Math.cos(toRadians(b.ltd)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}
module.exports.distanceKm = distanceKm;

// Pending requests near a captain, so one who goes online (or reconnects) after the
// broadcast still sees open rides instead of waiting for the next one.
module.exports.listAvailableRides = async ({ captain, radiusKm = 8 }) => {
  const here = point(captain.location);
  if (!here) return [];
  const cutoff = new Date(Date.now() - REQUEST_TTL_MS);
  const rides = await rideModel
    .find({ status: "pending", vehicle: captain.vehicle?.type, createdAt: { $gt: cutoff } })
    .sort({ createdAt: -1 })
    .limit(30)
    .populate("user", "fullname rating");
  return rides
    .filter((ride) => ride.pickupCoordinates && distanceKm(here, ride.pickupCoordinates) <= radiusKm)
    .slice(0, 10)
    .map((ride) => ({
      _id: ride._id,
      pickup: ride.pickup,
      destination: ride.destination,
      pickupCoordinates: ride.pickupCoordinates,
      destinationCoordinates: ride.destinationCoordinates,
      fare: ride.fare,
      vehicle: ride.vehicle,
      distance: ride.distance,
      duration: ride.duration,
      status: ride.status,
      pickupDistanceKm: Math.round(distanceKm(here, ride.pickupCoordinates) * 10) / 10,
      expiresAt: new Date(ride.createdAt.getTime() + REQUEST_TTL_MS),
      user: { fullname: ride.user?.fullname, rating: ride.user?.rating },
    }));
};

module.exports.captainEarnings = async (captainId) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - ((startOfDay.getDay() + 6) % 7));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [row] = await rideModel.aggregate([
    { $match: { captain: new mongoose.Types.ObjectId(captainId) } },
    {
      $group: {
        _id: null,
        completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
        totalEarned: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$fare", 0] } },
        distance: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$distance", 0] } },
        today: { $sum: { $cond: [{ $and: [{ $eq: ["$status", "completed"] }, { $gte: [{ $ifNull: ["$completedAt", "$updatedAt"] }, startOfDay] }] }, "$fare", 0] } },
        week: { $sum: { $cond: [{ $and: [{ $eq: ["$status", "completed"] }, { $gte: [{ $ifNull: ["$completedAt", "$updatedAt"] }, startOfWeek] }] }, "$fare", 0] } },
        month: { $sum: { $cond: [{ $and: [{ $eq: ["$status", "completed"] }, { $gte: [{ $ifNull: ["$completedAt", "$updatedAt"] }, startOfMonth] }] }, "$fare", 0] } },
        todayTrips: { $sum: { $cond: [{ $and: [{ $eq: ["$status", "completed"] }, { $gte: [{ $ifNull: ["$completedAt", "$updatedAt"] }, startOfDay] }] }, 1, 0] } },
      },
    },
  ]);
  const round = (n) => Math.round((n || 0) * 100) / 100;
  return {
    completed: row?.completed || 0,
    cancelled: row?.cancelled || 0,
    totalEarned: round(row?.totalEarned),
    distanceKm: Math.round((row?.distance || 0) / 1000),
    today: round(row?.today),
    week: round(row?.week),
    month: round(row?.month),
    todayTrips: row?.todayTrips || 0,
  };
};
