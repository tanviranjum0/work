const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body } = require("express-validator");
const { authUser } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

module.exports = ({ authLimiter, verificationLimiter }) => {
router.post("/register",
  authLimiter,
  body("email").isEmail().toLowerCase().withMessage("Invalid email"),
  body("password").isString().isLength({ min: 8 }).isByteLength({ max: 72 }).withMessage("Password must be 8-72 bytes"),
  body("fullname.firstname").isString().trim().isLength({ min: 3, max: 80 }),
  body("fullname.lastname").optional().isString().trim().isLength({ min: 3, max: 80 }),
  body("phone").isString().matches(/^\d{10}$/).withMessage("Phone number must contain 10 digits"),
  validate,
  userController.registerUser
);

router.post("/verify-email",
  verificationLimiter,
  body("token").isString().isLength({ min: 1, max: 4096 }),
  validate,
  userController.verifyEmail
);

router.post("/login",
    authLimiter,
    body("email").isEmail().toLowerCase().withMessage("Invalid email"),
    body("password").isString().isLength({ min: 8 }).isByteLength({ max: 72 }),
    validate,
    userController.loginUser
);

router.post("/update", authUser,
    body("fullname.firstname").isString().trim().isLength({ min: 3, max: 80 }),
    body("fullname.lastname").optional().isString().trim().isLength({ min: 3, max: 80 }),
    body("phone").isString().matches(/^\d{10}$/),
    validate,
    userController.updateUserProfile
);

router.get("/profile", authUser, userController.userProfile);

router.post("/logout", authUser, userController.logoutUser);

router.post(
    "/reset-password",
    verificationLimiter,
    body("token").isString().isLength({ min: 1, max: 4096 }),
    body("password").isString().isLength({ min: 8 }).isByteLength({ max: 72 }),
    validate,
    userController.resetPassword
);

return router;
};
