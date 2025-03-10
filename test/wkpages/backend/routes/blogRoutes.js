const express = require("express");
// const checkLogin = require("../middlewares/checkLogin");
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

router.post("/create", createBlog);
router.get("/all", getBlogs);
router.put("/:id", updateBlog);
router.get("/:id", getBlog);
router.delete("/:id", deleteBlog);
module.exports = router;
