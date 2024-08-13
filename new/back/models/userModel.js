const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plrease provide name"],
    },
    email: {
      type: String,
      required: [true, "PLease provide email"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
