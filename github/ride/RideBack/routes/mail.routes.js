const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mail.controller");
const { authUser, authCaptain } = require("../middlewares/auth.middleware");
const { body, param } = require("express-validator");
const validate = require("../middlewares/validate.middleware");

router.post("/verify-user-email", authUser, mailController.sendVerificationEmail);
router.post("/verify-captain-email", authCaptain, mailController.sendVerificationEmail);

router.post(
  "/:userType/reset-password",
  param("userType").isIn(["user", "captain"]),
  body("email").isEmail().toLowerCase().withMessage("Invalid email"),
  validate,
  mailController.forgotPassword,
);


module.exports = router;
