const asyncHandler = require("express-async-handler");
const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const { issueSession, clearSessionCookies } = require("../services/authSession.service");
const authController = require("./auth.controller");
const { applyPasswordReset } = require("../services/passwordReset.service");
const { disconnectUser } = require("../socket");
const { ConflictError, UnauthorizedError } = require("../utils/AppError");
const { serializeCaptain } = require("../services/accountSerializer");
const rideService = require("../services/ride.service");
const createTwoFactor = require("./twoFactor.controller");

const twoFactorFlow = createTwoFactor({ Model: captainModel, userType: "captain", serialize: serializeCaptain });
const twoFactorRequired = () => process.env.TWO_FACTOR_REQUIRED !== "false";
module.exports.activateTwoFactor = twoFactorFlow.activate;
module.exports.completeTwoFactorLogin = twoFactorFlow.completeLogin;
module.exports.setupTwoFactor = twoFactorFlow.setup;

module.exports.registerCaptain = asyncHandler(async (req, res) => {
  const { fullname, email, password, phone, vehicle } = req.body;

  let captain = await captainModel.findOne({ email });
  if (captain && captain.registrationStatus !== "pending_2fa") {
    throw new ConflictError("An account with this email already exists. Try logging in instead.", "ACCOUNT_EXISTS");
  }

  if (captain) {
    captain.fullname = { firstname: fullname.firstname, lastname: fullname.lastname };
    captain.password = await captainModel.hashPassword(password);
    captain.phone = phone;
    captain.vehicle = {
      color: vehicle.color,
      number: vehicle.number,
      capacity: vehicle.capacity,
      type: vehicle.type,
    };
  } else {
    captain = await captainService.createCaptain(
      fullname.firstname,
      fullname.lastname,
      email,
      password,
      phone,
      vehicle.color,
      vehicle.number,
      vehicle.capacity,
      vehicle.type,
    );
  }

  // Demo/free-tier mode: no transactional email provider, so skip the verification step.
  if (process.env.AUTO_VERIFY_EMAIL === "true") captain.emailVerified = true;

  if (twoFactorRequired()) {
    captain.registrationStatus = "pending_2fa";
    const enrollment = await twoFactorFlow.beginEnrollment(captain);
    return res.status(201).json({
      message: "Account created. Set up two-factor authentication to finish.",
      requiresTwoFactorSetup: true,
      ...enrollment,
    });
  }

  await captain.save();
  const token = await issueSession(captain, "captain", res);
  return res.status(201).json({
    message: "Captain registered successfully",
    token,
    captain: serializeCaptain(captain),
  });
});

module.exports.verifyEmail = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Invalid verification link", error: "Token is required" });
    }
  
    let decodedTokenData = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: process.env.JWT_ISSUER || "rideback-api",
      audience: process.env.JWT_AUDIENCE || "rideback-client",
    });
    if (
      !decodedTokenData ||
      decodedTokenData.purpose !== "email-verification" ||
      decodedTokenData.userType !== "captain"
    ) {
      return res.status(400).json({ message: "You're trying to use an invalid or expired verification link", error: "Invalid token" });
    }
  
    let captain = await captainModel.findOne({ _id: decodedTokenData.id });
  
    if (!captain) {
      return res.status(404).json({ message: "User not found. Please ask for another verification link." });
    }
  
    if (captain.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
  
    captain.emailVerified = true;
    await captain.save();
  
    res.status(200).json({
      message: "Email verified successfully",
    });
});

module.exports.loginCaptain = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password +tokenVersion");
  if (!captain || !(await captain.comparePassword(password))) {
    throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  if (captain.registrationStatus === "pending_2fa") {
    return res.status(200).json({
      message: "Finish setting up two-factor authentication to continue.",
      requiresTwoFactorSetup: true,
      ...(await twoFactorFlow.beginEnrollment(captain)),
    });
  }
  if (captain.twoFactor?.enabled) {
    return res.status(200).json({
      message: "Enter the code from your authenticator app.",
      ...twoFactorFlow.startChallenge(captain),
    });
  }

  const token = await issueSession(captain, "captain", res);
  return res.json({
    message: "Logged in successfully",
    token,
    captain: serializeCaptain(captain),
  });
});

module.exports.captainProfile = asyncHandler(async (req, res) => {
  const captain = await captainModel
    .findById(req.captain._id)
    .select("-__v")
    .populate({
      path: "rides",
      select: "pickup destination fare status vehicle distance duration createdAt updatedAt",
      options: { sort: { createdAt: -1 }, limit: 50 },
    })
    .lean();
  captain.twoFactorEnabled = Boolean(captain.twoFactor?.enabled);
  delete captain.twoFactor;
  res.status(200).json({ captain });
});

module.exports.updateCaptainProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { captainData } = req.body;
  const updates = {};
  if (captainData?.phone !== undefined) updates.phone = captainData.phone;
  if (captainData?.fullname?.firstname !== undefined) updates["fullname.firstname"] = captainData.fullname.firstname;
  if (captainData?.fullname?.lastname !== undefined) updates["fullname.lastname"] = captainData.fullname.lastname;
  if (captainData?.vehicle?.color !== undefined) updates["vehicle.color"] = captainData.vehicle.color;
  if (captainData?.vehicle?.number !== undefined) updates["vehicle.number"] = captainData.vehicle.number;
  if (captainData?.vehicle?.capacity !== undefined) updates["vehicle.capacity"] = captainData.vehicle.capacity;
  if (captainData?.vehicle?.type !== undefined) updates["vehicle.type"] = captainData.vehicle.type;
  const updatedCaptainData = await captainModel.findByIdAndUpdate(
    req.captain._id,
    { $set: updates },
    { new: true, runValidators: true, projection: { password: 0, __v: 0 } },
  );

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedCaptainData,
  });
});

module.exports.logoutCaptain = asyncHandler(async (req, res) => {
  await captainModel.updateOne({ _id: req.authUserId }, { status: "inactive" });
  if (req.authToken) await blacklistTokenModel.create({ token: req.authToken });
  await authController.revokeRefreshSession(req.cookies?.refreshToken);
  clearSessionCookies(res);
  disconnectUser("captain", req.authUserId);
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports.resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { token, password } = req.body;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: process.env.JWT_ISSUER || "rideback-api",
      audience: process.env.JWT_AUDIENCE || "rideback-client",
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "This password reset link has expired or is no longer valid. Please request a new one to continue" });
    } else {
      return res.status(400).json({ message: "The password reset link is invalid or has already been used. Please request a new one to proceed" });
    }
  }

  if (payload.userType !== "captain" || payload.purpose !== "password-reset") {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  if (!(await applyPasswordReset(captainModel, "captain", payload, password))) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  res.status(200).json({ message: "Your password has been successfully reset. You can now log in with your new credentials" });
});

module.exports.setStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (status === "inactive") {
    const busy = await require("../models/ride.model").exists({
      captain: req.captain._id,
      status: { $in: ["accepted", "ongoing"] },
    });
    if (busy) {
      throw new ConflictError("Finish your current ride before going offline.", "ACTIVE_RIDE_EXISTS");
    }
  }
  const captain = await captainModel
    .findByIdAndUpdate(req.captain._id, { status }, { new: true })
    .select("status");
  res.status(200).json({ status: captain.status });
});

module.exports.earnings = asyncHandler(async (req, res) => {
  res.status(200).json({ earnings: await rideService.captainEarnings(req.captain._id) });
});
