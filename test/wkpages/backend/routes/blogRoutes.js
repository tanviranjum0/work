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

router.get("/", (req, res) => {
  res.send("hello");
});

router.post("/create", checkLogin, createBlog);
router.get("/all", checkLogin, getBlogs);
router.put("/:id", checkLogin, updateBlog);
router.get("/:id", checkLogin, getBlog);
router.delete("/:id", checkLogin, deleteBlog);
module.exports = router;
