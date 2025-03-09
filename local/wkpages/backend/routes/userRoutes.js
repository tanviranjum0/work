const express = require("express");
// const checkLogin = require("../middlewares/checkLogin");
const {
  getUser,
  handleCreateUser,
  handleLoginUser,
} = require("../controllers/userController.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello");
});
router.post("/create", handleCreateUser);
router.post("/login", handleLoginUser);
router.post("/get-one", getUser);
module.exports = router;
