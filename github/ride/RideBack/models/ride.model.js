const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema(
  { ltd: { type: Number, required: true }, lng: { type: Number, required: true } },
  { _id: false },
);

const ratingEntry = new mongoose.Schema(
  {
    stars: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, maxlength: 280 },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
    },
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    // Resolved once at booking so live tracking never has to geocode again.
    pickupCoordinates: pointSchema,
    destinationCoordinates: pointSchema,
    fare: {
      type: Number,
      required: true,
    },
    vehicle: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    duration: {
      type: Number,
    }, // in seconds

    distance: {
      type: Number,
    }, // in meters

    paymentMethod: { type: String, enum: ["cash"], default: "cash" },
    paymentID: {
      type: String,
    },
    orderId: {
      type: String,
    },
    signature: {
      type: String,
    },
    otp: {
      type: String,
      select: false,
    },
    otpHash: {
      type: String,
      select: false,
    },

    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancelledBy: { type: String, enum: ["user", "captain", "system"] },
    cancelReason: { type: String, trim: true, maxlength: 120 },

    rating: {
      byUser: ratingEntry,
      byCaptain: ratingEntry,
    },
    // Unguessable token behind the public "follow my trip" link.
    shareToken: { type: String, select: false, index: true, sparse: true },
    sos: {
      at: Date,
      by: { type: String, enum: ["user", "captain"] },
      location: pointSchema,
    },

    messages: [
      {
        msg: String,
        by: {
          type: String,
          enum: ["user", "captain"],
        },
        time: String,
        date: String,
        timestamp: Date,
        _id: false
      },
    ],
  },
  { timestamps: true }
);

rideSchema.index({ user: 1, status: 1, createdAt: -1 });
rideSchema.index({ captain: 1, status: 1, createdAt: -1 });
rideSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Ride", rideSchema);
