const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twoFactorSchema = require("./twoFactor.schema");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: 2,
      },
      lastname: {
        type: String,
        minlength: 1,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      minlength: 10,
      maxlength: 10,
    },
    socketId: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
      select: false,
    },
    // "pending_2fa" accounts exist but cannot sign in until two-factor setup is confirmed.
    registrationStatus: {
      type: String,
      enum: ["pending_2fa", "active"],
      default: "active",
    },
    twoFactor: { type: twoFactorSchema, default: () => ({}) },
    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    savedPlaces: {
      type: [
        {
          label: { type: String, trim: true, maxlength: 30, required: true },
          address: { type: String, trim: true, maxlength: 256, required: true },
        },
      ],
      validate: [(places) => places.length <= 8, "You can save up to 8 places."],
    },
    emergencyContacts: {
      type: [
        {
          name: { type: String, trim: true, maxlength: 60, required: true },
          phone: { type: String, trim: true, match: /^d{10}$/, required: true },
        },
      ],
      validate: [(contacts) => contacts.length <= 3, "You can add up to 3 emergency contacts."],
    },
    rides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
      },
    ],
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, userType: "user", version: this.tokenVersion || 0, purpose: "access" },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      issuer: process.env.JWT_ISSUER || "rideback-api",
      audience: process.env.JWT_AUDIENCE || "rideback-client",
      expiresIn: "15m",
    }
  );
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
