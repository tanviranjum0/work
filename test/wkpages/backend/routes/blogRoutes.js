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

const { authorization } = require("../middlewares/authorize.js");
const router = express.Router();

router.post("/create", checkLogin, authorization(["admin"]), createBlog);
router.get("/all", getBlogs);
router.post("/all/bycategory", getBlogsByCategory);
router.post("/all/bytag", getBlogsByTag);
router.put("/update/:id", checkLogin, authorization(["admin"]), updateBlog);
router.get("/:id", getBlog);
router.delete("/:id", checkLogin, authorization(["admin"]), deleteBlog);
module.exports = router;
