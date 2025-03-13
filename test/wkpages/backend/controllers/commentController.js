const Comment = require("../models/blogCommentModel.js");
const Blog = require("../models/blogModel.js");
const User = require("../models/userModel.js");
const addComment = async (req, res) => {
  const { email, message, name } = req.body;
  console.log({ email, message, name });
  const blog = await Blog.findById(req.params.blogId);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  } else if (email && message && name) {
    const comment = await Comment.create({
      email,
      message,
      name,
      blogId: req.params.blogId,
    });
    return res.status(201).json({ message: "Successful", comment });
  } else {
    return res.status(400).json({ message: "Something went wrong" });
  }
};

const deleteComment = async (req, res) => {
  const user = User.findOne(req.user.id);
  if (user.role == "admin") {
    const comment = await Comment.findByIdAndDelete(req.params.blogId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    } else {
      res.status(200).json({ message: "Comment deleted successfully" });
    }
  } else {
    res
      .status(200)
      .json({ message: "You are not authorized to delete comments" });
  }
};

const getComments = async (req, res) => {
  const comments = await Comment.find({ blogId: req.params.blogId });
  if (!comments) {
    return res.status(404).json({ message: "No comments found for this blog" });
  } else {
    res
      .status(200)
      .json({ message: "Comments fetched successfully", comments });
  }
};

module.exports = { addComment, deleteComment, getComments };
