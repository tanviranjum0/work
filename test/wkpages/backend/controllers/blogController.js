const Blog = require("../models/blogModel.js");
const createBlog = async (req, res) => {
  const { title, content, poster, admin_id, category, status } = await req.body;
  try {
    if (title && content && poster && admin_id && category && status) {
      const blog = await Blog.create(req.body);
      res.status(201).json(blog);
    }
  } catch (error) {
    res.status(400).json("Something went wrong");
  }
};

const deleteBlog = async (req, res) => {
  const Blog = await Blog.findById(req.params.id);

  if (!Blog) {
    res.status(400).send("Blog not found!");
  }

  if (req.user.id !== Blog.userRef) {
    res.status(400).send("You can only delete your own Blogs!");
  }

  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json("Blog has been deleted!");
  } catch (error) {
    res.status(400).send("There is a problem in Blog manupulating");
  }
};

const updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(400).send("Blog not found!");
  }
  //   if (req.user.id !== blog._id) {
  //     res.status(400).send("You can only update your own Blogs!");
  //   }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).send("There is a problem in Blog manupulating");
  }
};

const getBlog = async (req, res) => {
  console.log(req.params);
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(200).send("Blog not found!");
    } else {
      res.status(200).json(blog);
    }
  } catch (error) {
    res.status(400).send("There is a problem in Blog manupulating");
  }
};

const getBlogs = async (req, res, next) => {
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
    res.status(400).send("There is a problem in Blog Search");
  }
};

module.exports = {
  getBlog,
  deleteBlog,
  updateBlog,
  createBlog,
  getBlogs,
};
