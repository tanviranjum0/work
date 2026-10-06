const express = require("express");
const checkLogin = require("../middlewares/checkLogin");
const { checkOrigin } = require("../middlewares/checkOrigin");
const {
  deleteUser,
  getUser,
  getUserListings,
  updateUser,
} = require("../handlers/user");
const router = express.Router();

router.post("/update/:id", checkOrigin, checkLogin, updateUser);
router.delete("/delete/:id", checkOrigin, checkLogin, deleteUser);
router.get("/listings", checkLogin, getUserListings);
router.get("/:identifier", getUser);
module.exports = router;
