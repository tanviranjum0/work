"use strict";

const mongoose = require("mongoose");

const refreshSessionSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true, unique: true, select: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userType: { type: String, enum: ["user", "captain"], required: true },
    tokenVersion: { type: Number, default: 0, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshSessionSchema.index({ userId: 1, userType: 1 });

module.exports = mongoose.model("RefreshSession", refreshSessionSchema);
