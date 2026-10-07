"use strict";

const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");
const { UnauthorizedError } = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
  issueSession,
  rotateRefreshToken,
  hashToken,
  clearSessionCookies,
} = require("../services/authSession.service");
const RefreshSession = require("../models/refreshSession.model");

module.exports.refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new UnauthorizedError("Refresh token is required.", "NO_REFRESH_TOKEN");

  const session = await rotateRefreshToken(refreshToken);
  if (!session) {
    clearSessionCookies(res);
    throw new UnauthorizedError("Refresh token is invalid or expired.", "INVALID_REFRESH_TOKEN");
  }

  const Model = session.userType === "user" ? userModel : captainModel;
  const account = await Model.findById(session.userId).select("-__v +tokenVersion");
  if (!account || (session.tokenVersion || 0) !== (account.tokenVersion || 0)) {
    clearSessionCookies(res);
    throw new UnauthorizedError("Account is unavailable.", "ACCOUNT_UNAVAILABLE");
  }

  const token = await issueSession(account, session.userType, res);
  return res.status(200).json({ token, userType: session.userType });
});

module.exports.revokeRefreshSession = async (refreshToken) => {
  if (!refreshToken) return;
  await RefreshSession.deleteOne({ tokenHash: hashToken(refreshToken) });
};
