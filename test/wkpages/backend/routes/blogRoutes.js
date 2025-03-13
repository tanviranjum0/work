const express = require("express");
const checkLogin = require("../middlewares/checkLogin");
const {
  getBlog,
  deleteBlog,
  updateBlog,
  createBlog,
  getBlogs,
} = require("../controllers/blogController.js");

const router = express.Router();

router.post("/create", checkLogin, createBlog);
router.get("/all", getBlogs);
router.put("/:id", checkLogin, updateBlog);
router.get("/:id", getBlog);
router.delete("/:id", checkLogin, deleteBlog);
module.exports = router;
