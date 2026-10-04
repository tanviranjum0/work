const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const { sendMail } = require("../services/mail.service");
let { fillTemplate } = require("../templates/mail.template");
const captainModel = require("../models/captain.model");
const userModel = require("../models/user.model");
const logger = require("../utils/logger");
const { enqueueEmail } = require("../services/jobQueue.service");
const { applyPasswordReset } = require("../services/passwordReset.service");

module.exports.sendVerificationEmail = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  let user;

  if (req.userType === "user") {
    user = req.user;
  } else if (req.userType === "captain") {
    user = req.captain;
  } else {
    return res.status(400).json({
      message:
        "The email verification link is invalid because of incorrect user type",
    });
  }

  if (user.emailVerified) {
    return res.status(400).json({
      message:
        "Your email is already verified. You may continue using the application.",
    });
  }

  const token = jwt.sign(
    { id: user._id, userType: req.userType, purpose: "email-verification" },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      issuer: process.env.JWT_ISSUER || "rideback-api",
      audience: process.env.JWT_AUDIENCE || "rideback-client",
      expiresIn: "15m",
    },
  );

  if (!token) {
    return res.status(500).json({
      message:
        "We're unable to generate a verification link at the moment. Please try again shortly.",
    });
  }

  try {
    const verification_link = `${process.env.CLIENT_URL}/${req.userType}/verify-email?token=${token}`;

    let mailHtml = fillTemplate({
      title: "Email Verification Required",
      name: user.fullname.firstname,
      message:
        "Thank you for signing up with QuickRide! To complete your registration and activate your account, please verify your email address by clicking the button below.",
      cta_link: verification_link,
      cta_text: "Verify Email",
      note: "For your security, this verification link is valid for 15 minutes. If the link expires, you can request a new one from the login page. If you did not create a QuickRide account, please disregard this email.",
    });

    const email = {
      to: user.email,
      subject: "QuickRide - Email Verification",
      html: mailHtml,
    };
    if (!(await enqueueEmail(email))) {
      await sendMail(email.to, email.subject, email.html);
    }

    return res.status(200).json({
      message: "Verification email queued successfully",
      user: {
        email: user.email,
        fullname: user.fullname,
      },
    });
  } catch (error) {
    logger.error("Verification email delivery failed");
    return res
      .status(500)
      .json({ message: "Failed to send verification email" });
  }
});

module.exports.forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { email } = req.body;
  const { userType } = req.params;

  let user = null;
  if (userType === "user") {
    user = await userModel.findOne({ email }).select("+tokenVersion");
  } else if (userType === "captain") {
    user = await captainModel.findOne({ email }).select("+tokenVersion");
  }
  if (!user) {
    return res.status(200).json({
      message: "If an account exists for that email, password reset instructions will be sent.",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      userType,
      purpose: "password-reset",
      version: user.tokenVersion || 0,
    },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      issuer: process.env.JWT_ISSUER || "rideback-api",
      audience: process.env.JWT_AUDIENCE || "rideback-client",
      expiresIn: "15m",
    },
  );

  const resetLink = `${process.env.CLIENT_URL}/${userType}/reset-password?token=${token}`;

  let mailHtml = fillTemplate({
    title: "Reset Password",
    name: user.fullname.firstname,
    message:
      "We received a request to reset the password associated with your QuickRide account. If you made this request, please click the button below to proceed.",
    cta_link: resetLink,
    cta_text: "Reset Password",
    note: "If you didn’t request a password reset, you can safely ignore this email. Your current password will remain unchanged. This verification link is valid for 15 minutes only.",
  });

  const emailMessage = {
    to: user.email,
    subject: "QuickRide - Reset Password",
    html: mailHtml,
  };
  if (!(await enqueueEmail(emailMessage))) {
    await sendMail(emailMessage.to, emailMessage.subject, emailMessage.html);
  }

  res.status(200).json({
    message: "If an account exists for that email, password reset instructions will be sent.",
  });
});

// Reset Password
module.exports.resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors.array());

  const { token, password } = req.body;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: process.env.JWT_ISSUER || "rideback-api",
      audience: process.env.JWT_AUDIENCE || "rideback-client",
    });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  if (payload.userType !== "user" || payload.purpose !== "password-reset") {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  if (!(await applyPasswordReset(userModel, "user", payload, password))) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  res.status(200).json({ message: "Password reset successfully" });
});
