const express = require("express");
const checkLogin = require("../middlewares/checkLogin");
const { authorization } = require("../middlewares/authorize.js");
const {
  getUser,
  handleCreateUser,
  handleLoginUser,
  getUserById,
} = require("../controllers/UserController.js");

const router = express.Router();

router.post("/create", handleCreateUser);
router.post("/login", handleLoginUser);
router.post("/get-one", getUser);
router.get("/user", checkLogin, authorization(["admin"]), getUserById);
module.exports = router;
