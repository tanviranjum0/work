const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    poster: {
      type: String,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Published", "Archived", "Draft", "Deleted"],
      default: "Published",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
