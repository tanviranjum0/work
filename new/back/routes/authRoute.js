const express = require("express");
const {
  signup,
  login,
  logOut,
  getMe,
} = require("../controllers/authController");

const { checkLogin } = require("../utils/checkLogin");
const router = express.Router();
router.get("/", (req, res) => {
  console.log("hello");
});
router.get("/me", checkLogin, getMe);
router.post("/login", login);
router.post("/register", signup);

module.exports = router;
