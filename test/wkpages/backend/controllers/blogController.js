const Blog = require("../models/blogModel.js");
const Comment = require("../models/blogCommentModel.js");
const createBlog = async (req, res) => {
  const { title, content, poster, visibility, tags, category, status } =
    await req.body;
  try {
    const blog = await Blog.create({
      title,
      visibility,
      content,
      tags,
      poster,
      owner_id: req.user.id,
      category,
      status,
    });
    const blogDetails = await Blog.find(blog._id).populate("owner_id").exec();
    res.status(201).json({ message: "Successful", blogDetail: blogDetails[0] });
  } catch (error) {
    res.status(200).json({ message: "Something went wrong" });
  }
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(200).json({ message: "Blog not found!" });
  }

  if (req.user.id !== blog.owner_id.toString()) {
    return res
      .status(200)
      .json({ message: "You can only delete your own Blogs!" });
  }

  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Successful" });
  } catch (error) {
    res
      .status(200)
      .json({ message: "There is a problem in Blog manupulating" });
  }
};

const updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(200).json({ message: "Blog not found!" });
  }
  if (req.user.id !== blog.owner_id.toString()) {
    res.status(200).json({ message: "You can only update your own Blogs!" });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body
    ).populate("owner_id");
    res.status(200).json({ message: "Successful", updatedBlog });
  } catch (error) {
    res
      .status(200)
      .json({ message: "There is a problem in Blog manupulating" });
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(200).json({ message: "Blog not found!" });
    } else {
      res.status(200).json({ message: "Successful", blog });
    }
  } catch (error) {
    res
      .status(200)
      .json({ message: "There is a problem in Blog manupulating" });
  }
};

const getBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const blogs = await Blog.find()
      .populate("owner_id")
      .sort({ createdAt: "desc" })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(blogs);
  } catch (error) {
    res.status(200).json({ message: "There is a problem in Blogs Search" });
  }
};

const getBlogsByCategory = async (req, res) => {
  const blogs = await Blog.find({
    category: {
      $in: [req.body.payload],
    },
  })
    .populate("owner_id")
    .limit(12)
    .exec();
  if (blogs.length == 0) {
    res.json({ message: "No blogs found" });
  } else {
    res.json({ message: "Successful", blogs });
  }
};
const getBlogsByTag = async (req, res) => {
  const blogs = await Blog.find({
    tags: {
      $in: [req.body.payload],
    },
  })
    .populate("owner_id")
    .limit(12)
    .exec();
  if (blogs.length == 0) {
    res.json({ message: "No blogs found" });
  } else {
    res.json({ message: "Successful", blogs });
  }
};

module.exports = {
  getBlog,
  deleteBlog,
  getBlogsByCategory,
  updateBlog,
  getBlogsByTag,
  createBlog,
  getBlogs,
};
