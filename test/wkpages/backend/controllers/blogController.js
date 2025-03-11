const Blog = require("../models/blogModel.js");
const createBlog = async (req, res) => {
  const { title, content, poster, visibility, category, status } =
    await req.body;
  console.log(req.body);
  try {
    if (title && content && visibility && poster && category) {
      const blog = await Blog.create({
        title,
        visibility,
        content,
        poster,
        admin_id: req.user.id,
        category,
        status,
      });
      console.log(blog);
      res.status(201).json({ message: "Successful", blog });
    }
  } catch (error) {
    res.status(200).json({ message: "Something went wrong" });
  }
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  console.log(blog);
  if (!blog) {
    return res.status(200).json({ message: "Blog not found!" });
  }

  if (req.user.id !== blog.admin_id.toString()) {
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
  if (req.user.id !== blog.admin_id.toString()) {
    res.status(200).json({ message: "You can only update your own Blogs!" });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Successful", updatedBlog });
  } catch (error) {
    res
      .status(200)
      .json({ message: "There is a problem in Blog manupulating" });
  }
};

const getBlog = async (req, res) => {
  console.log(req.params);
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(200).json({ message: "Blog not found!" });
    } else if (req.user.id !== blog.admin_id.toString()) {
      res
        .status(200)
        .json({ message: "You are not authorized to view this blog!" });
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
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const Blogs = await Blog.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(Blogs);
  } catch (error) {
    res.status(200).json({ message: "There is a problem in Blog Search" });
  }
};

module.exports = {
  getBlog,
  deleteBlog,
  updateBlog,
  createBlog,
  getBlogs,
};
