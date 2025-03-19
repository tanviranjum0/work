const express = require("express");
const checkLogin = require("../middlewares/checkLogin");
const {
  getBlog,
  deleteBlog,
  getBlogsByCategory,
  getBlogsByTag,
  updateBlog,
  createBlog,
  getSpecificBlogs,
  getBlogs,
} = require("../controllers/blogController.js");

const { authorization } = require("../middlewares/authorize.js");
const router = express.Router();

router.post("/create", checkLogin, authorization(["admin"]), createBlog);
router.get("/all", getBlogs);
router.get("/allspecific", getSpecificBlogs);
router.post("/all/bycategory", getBlogsByCategory);
router.post("/all/bytag", getBlogsByTag);
router.put("/update/:id", checkLogin, authorization(["admin"]), updateBlog);
router.get("/:id", getBlog);
router.delete("/delete/:id", checkLogin, authorization(["admin"]), deleteBlog);
module.exports = router;
