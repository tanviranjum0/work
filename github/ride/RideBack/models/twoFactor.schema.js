"use strict";

const mongoose = require("mongoose");

// Shared by User and Captain. Everything sensitive is select:false so it never leaks
// through a normal query and must be requested explicitly (see twoFactor.controller).
const twoFactorSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    enabledAt: { type: Date },
    secret: { type: String, select: false },
    lastUsedStep: { type: Number, default: 0, select: false },
    failedAttempts: { type: Number, default: 0, select: false },
    lockedUntil: { type: Date, select: false },
    recoveryCodes: {
      type: [{ hash: { type: String, required: true }, usedAt: Date, _id: false }],
      select: false,
      default: undefined,
    },
  },
  { _id: false },
);

module.exports = twoFactorSchema;
