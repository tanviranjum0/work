"use strict";

const crypto = require("node:crypto");
const RefreshSession = require("../models/refreshSession.model");

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function cookieOptions(path, maxAge) {
  return {
    httpOnly: true,
    secure: process.env.ENVIRONMENT === "production",
    // "lax" when the SPA proxies the API same-origin (Vercel rewrite); "none" for a
    // genuinely cross-site API. Override with COOKIE_SAMESITE.
    sameSite:
      process.env.COOKIE_SAMESITE ||
      (process.env.ENVIRONMENT === "production" ? "none" : "lax"),
    path,
    maxAge,
  };
}

async function issueSession(account, userType, res) {
  const accessToken = account.generateAuthToken();
  const refreshToken = crypto.randomBytes(48).toString("base64url");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await RefreshSession.create({
    tokenHash: hashToken(refreshToken),
    userId: account._id,
    userType,
    tokenVersion: account.tokenVersion || 0,
    expiresAt,
  });

  res.cookie("token", accessToken, cookieOptions("/", ACCESS_TOKEN_TTL_MS));
  res.cookie("refreshToken", refreshToken, cookieOptions("/", REFRESH_TOKEN_TTL_MS));
  return accessToken;
}

async function rotateRefreshToken(refreshToken, res) {
  const session = await RefreshSession.findOneAndDelete({
    tokenHash: hashToken(refreshToken),
    expiresAt: { $gt: new Date() },
  }).select("+tokenHash");
  return session;
}

function clearSessionCookies(res) {
  res.clearCookie("token", cookieOptions("/", 0));
  res.clearCookie("refreshToken", cookieOptions("/", 0));
}

module.exports = {
  hashToken,
  issueSession,
  rotateRefreshToken,
  clearSessionCookies,
};
