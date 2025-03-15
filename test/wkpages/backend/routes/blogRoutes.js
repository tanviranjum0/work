const express = require("express");
const checkLogin = require("../middlewares/checkLogin");
const {
  getBlog,
  deleteBlog,
  getBlogsByCategory,
  getBlogsByTag,
  updateBlog,
  createBlog,
  getBlogs,
} = require("../controllers/blogController.js");

const router = express.Router();

router.post("/create", checkLogin, createBlog);
router.get("/all", getBlogs);
router.post("/all/bycategory", getBlogsByCategory);
router.post("/all/bytag", getBlogsByTag);
router.put("/:id", checkLogin, updateBlog);
router.get("/:id", getBlog);
router.delete("/:id", checkLogin, deleteBlog);
module.exports = router;
