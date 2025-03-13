const express = require("express");
const checkLogin = require("../middlewares/checkLogin");
const {
  addComment,
  deleteComment,
  getComments,
} = require("../controllers/commentController.js");

const router = express.Router();

router.post("/add/:blogId", addComment);
router.get("/all/:blogId", getComments);
router.delete("/delete/:blogId", checkLogin, deleteComment);

module.exports = router;
