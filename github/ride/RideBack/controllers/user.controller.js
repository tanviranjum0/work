const asyncHandler = require("express-async-handler");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const { issueSession, clearSessionCookies } = require("../services/authSession.service");
const authController = require("./auth.controller");
const { applyPasswordReset } = require("../services/passwordReset.service");
const { disconnectUser } = require("../socket");
const { ConflictError, UnauthorizedError } = require("../utils/AppError");
const { serializeUser } = require("../services/accountSerializer");
const createTwoFactor = require("./twoFactor.controller");

const twoFactorFlow = createTwoFactor({ Model: userModel, userType: "user", serialize: serializeUser });
const twoFactorRequired = () => process.env.TWO_FACTOR_REQUIRED !== "false";
module.exports.activateTwoFactor = twoFactorFlow.activate;
module.exports.completeTwoFactorLogin = twoFactorFlow.completeLogin;
module.exports.setupTwoFactor = twoFactorFlow.setup;

module.exports.registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, phone } = req.body;

  let user = await userModel.findOne({ email });
  if (user && user.registrationStatus !== "pending_2fa") {
    throw new ConflictError("An account with this email already exists. Try logging in instead.", "ACCOUNT_EXISTS");
  }

  if (user) {
    // An earlier sign-up was never finished (two-factor not confirmed): let it start over.
    user.fullname = { firstname: fullname.firstname, lastname: fullname.lastname };
    user.password = await userModel.hashPassword(password);
    user.phone = phone;
  } else {
    user = await userService.createUser(fullname.firstname, fullname.lastname, email, password, phone);
  }

  // Demo/free-tier mode: no transactional email provider, so skip the verification step.
  if (process.env.AUTO_VERIFY_EMAIL === "true") user.emailVerified = true;

  if (twoFactorRequired()) {
    user.registrationStatus = "pending_2fa";
    const enrollment = await twoFactorFlow.beginEnrollment(user);
    return res.status(201).json({
      message: "Account created. Set up two-factor authentication to finish.",
      requiresTwoFactorSetup: true,
      ...enrollment,
    });
  }

  await user.save();
  const token = await issueSession(user, "user", res);
  return res.status(201).json({
    message: "User registered successfully",
    token,
    user: serializeUser(user),
  });
});

module.exports.verifyEmail = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({
      message: "Invalid verification link",
      error: "Token is required",
    });
  }

  let decodedTokenData = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: process.env.JWT_ISSUER || "rideback-api",
    audience: process.env.JWT_AUDIENCE || "rideback-client",
  });
  if (
    !decodedTokenData ||
    decodedTokenData.purpose !== "email-verification" ||
    decodedTokenData.userType !== "user"
  ) {
    return res.status(400).json({
      message: "You're trying to use an invalid or expired verification link",
      error: "Invalid token",
    });
  }

  let user = await userModel.findOne({ _id: decodedTokenData.id });

  if (!user) {
    return res.status(404).json({
      message: "User not found. Please ask for another verification link.",
    });
  }

  if (user.emailVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }

  user.emailVerified = true;
  await user.save();

  res.status(200).json({
    email: user.email,
    message: "Email verified successfully",
  });
});

module.exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password +tokenVersion");
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  if (user.registrationStatus === "pending_2fa") {
    return res.status(200).json({
      message: "Finish setting up two-factor authentication to continue.",
      requiresTwoFactorSetup: true,
      ...(await twoFactorFlow.beginEnrollment(user)),
    });
  }
  if (user.twoFactor?.enabled) {
    return res.status(200).json({
      message: "Enter the code from your authenticator app.",
      ...twoFactorFlow.startChallenge(user),
    });
  }

  // Accounts created before two-factor existed sign in directly and are nudged to enable it.
  const token = await issueSession(user, "user", res);
  return res.json({
    message: "Logged in successfully",
    token,
    user: serializeUser(user),
  });
});

module.exports.userProfile = asyncHandler(async (req, res) => {
  const user = await userModel
    .findById(req.user._id)
    .select("-__v")
    .populate({
      path: "rides",
      select: "pickup destination fare status vehicle distance duration createdAt updatedAt",
      options: { sort: { createdAt: -1 }, limit: 50 },
    })
    .lean();
  user.twoFactorEnabled = Boolean(user.twoFactor?.enabled);
  delete user.twoFactor;
  res.status(200).json({ user });
});

module.exports.updateUserProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { fullname, phone } = req.body;

  const updatedUserData = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      fullname: fullname,
      phone,
    },
    { new: true, runValidators: true, projection: { password: 0, __v: 0 } },
  );

  res
    .status(200)
    .json({ message: "Profile updated successfully", user: updatedUserData });
});

module.exports.logoutUser = asyncHandler(async (req, res) => {
  if (req.authToken) await blacklistTokenModel.create({ token: req.authToken });
  await authController.revokeRefreshSession(req.cookies?.refreshToken);
  clearSessionCookies(res);
  disconnectUser("user", req.authUserId);
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
      return res.status(400).json({
        message:
          "This password reset link has expired or is no longer valid. Please request a new one to continue",
      });
    } else {
      return res.status(400).json({
        message:
          "The password reset link is invalid or has already been used. Please request a new one to proceed",
      });
    }
  }

  if (payload.userType !== "user" || payload.purpose !== "password-reset") {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  if (!(await applyPasswordReset(userModel, "user", payload, password))) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  res.status(200).json({
    message:
      "Your password has been successfully reset. You can now log in with your new credentials",
  });
});

module.exports.updateSavedPlaces = asyncHandler(async (req, res) => {
  const user = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { savedPlaces: req.body.places },
      { new: true, runValidators: true },
    )
    .select("savedPlaces");
  res.status(200).json({ savedPlaces: user.savedPlaces });
});

module.exports.updateEmergencyContacts = asyncHandler(async (req, res) => {
  const user = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { emergencyContacts: req.body.contacts },
      { new: true, runValidators: true },
    )
    .select("emergencyContacts");
  res.status(200).json({ emergencyContacts: user.emergencyContacts });
});
