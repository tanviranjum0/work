const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const locationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (coordinates) =>
          coordinates.length === 2 &&
          coordinates.every(Number.isFinite) &&
          coordinates[0] >= -180 &&
          coordinates[0] <= 180 &&
          coordinates[1] >= -90 &&
          coordinates[1] <= 90,
        message: "Location coordinates must be valid longitude/latitude values.",
      },
    },
  },
  { _id: false },
);

const captainSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: 3,
      },
      lastname: {
        type: String,
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
    rides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    vehicle: {
      color: {
        type: String,
        required: true,
        minlength: [3, "Color must be at least 3 characters long"],
      },
      number: {
        type: String,
        required: true,
        minlength: [3, "Plate must be at least 3 characters long"],
      },
      capacity: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        required: true,
        enum: ["car", "bike", "auto"],
      },
    },

    location: { type: locationSchema, default: undefined },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  { timestamps: true }
);

captainSchema.index({ location: "2dsphere" });
captainSchema.index({ status: 1, "vehicle.type": 1 });

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

captainSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, userType: "captain", version: this.tokenVersion || 0, purpose: "access" },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      issuer: process.env.JWT_ISSUER || "rideback-api",
      audience: process.env.JWT_AUDIENCE || "rideback-client",
      expiresIn: "15m",
    }
  );
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Captain", captainSchema);
