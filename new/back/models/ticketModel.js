const mongoose = require("mongoose");
const ticketSchema = mongoose.Schema(
  {
    seating: {
      type: String,
      required: [true, "Please select a seating"],
      enum: ["Platinum", "Gold", "Silver", "Reguler"],
    },
    payment: {
      type: String,
      required: [true, "Please select a payment"],
      enum: ["Visa", "American Express", "Mastercard"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description of the issue"],
    },
    status: {
      type: String,
      required: true,
      enum: ["new", "open", "closed"],
      default: "new",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tickets", ticketSchema);
