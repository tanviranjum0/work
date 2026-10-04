"use strict";

const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { getRedisClient, whenRedisReady } = require("../config/redis");
const { TooManyRequestsError } = require("../utils/AppError");

function createLimiter({ windowMs, limit, prefix, message }) {
  const store = getRedisClient()
    ? new RedisStore({
        prefix: `rideback:${prefix}:`,
        sendCommand: async (...args) => {
          await whenRedisReady();
          return getRedisClient().sendCommand(args);
        },
      })
    : undefined;

  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    store,
    handler: (req, res, next) =>
      next(new TooManyRequestsError(message, "RATE_LIMIT_EXCEEDED")),
  });
}

const globalLimiter = createLimiter({
  windowMs: 60_000,
  limit: 300,
  prefix: "global",
  message: "Too many requests. Please try again shortly.",
});
const authLimiter = createLimiter({
  windowMs: 15 * 60_000,
  limit: 20,
  prefix: "auth",
  message: "Too many authentication attempts. Please try again later.",
});
const verificationLimiter = createLimiter({
  windowMs: 10 * 60_000,
  limit: 5,
  prefix: "verification",
  message: "Too many verification attempts. Please try again later.",
});
const rideCreationLimiter = createLimiter({
  windowMs: 60_000,
  limit: 10,
  prefix: "ride-create",
  message: "Ride request limit reached. Please slow down.",
});
const mapLimiter = createLimiter({
  windowMs: 60_000,
  limit: 60,
  prefix: "maps",
  message: "Map request limit reached. Please slow down.",
});
// Separate from verificationLimiter: refresh fires every ~15 minutes per active session
// (once per device/tab), so it needs more headroom than email/OTP verification does.
const refreshLimiter = createLimiter({
  windowMs: 15 * 60_000,
  limit: 30,
  prefix: "refresh",
  message: "Too many session refresh attempts. Please log in again.",
});

module.exports = {
  globalLimiter,
  authLimiter,
  verificationLimiter,
  rideCreationLimiter,
  mapLimiter,
  refreshLimiter,
};
