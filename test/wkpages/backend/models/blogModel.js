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
    isPrivate: {
      type: Boolean,
      default: false,
    },
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    poster: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Design",
        "Development",
        "Education",
        "Technology",
        "Business",
        "Social Media",
        "Writing",
      ],
    },
    status: {
      type: String,
      enum: ["Published", "Archived", "Draft", "Deleted"],
      default: "Published",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
