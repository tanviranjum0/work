const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: 3,
      },
      lastname: {
        type: String,
        minlength: 3,
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
