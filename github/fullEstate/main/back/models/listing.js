const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    secure_url: { type: String, required: true, maxlength: 2048 },
    public_id: { type: String, required: true, maxlength: 255 },
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    address: { type: String, required: true, trim: true, maxlength: 200 },
    regularPrice: { type: Number, required: true, min: 1, max: 100000000 },
    discountPrice: { type: Number, required: true, min: 0, max: 100000000 },
    bathrooms: { type: Number, required: true, min: 1, max: 20 },
    bedrooms: { type: Number, required: true, min: 1, max: 20 },
    furnished: { type: Boolean, required: true },
    parking: { type: Boolean, required: true },
    type: { type: String, required: true, enum: ["sale", "rent"] },
    offer: { type: Boolean, required: true },
    imageUrls: {
      type: [imageSchema],
      default: [],
      validate: {
        validator: (images) => images.length > 0 && images.length <= 6,
        message: "Add one to six images.",
      },
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
);

listingSchema.index({ type: 1, createdAt: -1 });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
