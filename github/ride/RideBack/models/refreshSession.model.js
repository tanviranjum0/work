"use strict";

const mongoose = require("mongoose");

const refreshSessionSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true, unique: true, select: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userType: { type: String, enum: ["user", "captain"], required: true },
    tokenVersion: { type: Number, default: 0, required: true },
    expiresAt: { type: Date, required: true },
    // Set the first time this token is exchanged; see rotateRefreshToken for the grace window.
    rotatedAt: { type: Date },
  },
  { timestamps: true },
);

refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshSessionSchema.index({ userId: 1, userType: 1 });
// A rotated token is only useful for the grace window; let Mongo clear it shortly after.
refreshSessionSchema.index({ rotatedAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model("RefreshSession", refreshSessionSchema);
