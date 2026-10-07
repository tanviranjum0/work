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
  body("fullname.firstname").isString().trim().isLength({ min: 2, max: 80 }).withMessage("First name must be 2 to 80 characters").withMessage("First name must be 2 to 80 characters"),
  body("fullname.lastname").optional().isString().trim().isLength({ min: 1, max: 80 }).withMessage("Last name must be 1 to 80 characters"),
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


router.post("/2fa/activate",
  authLimiter,
  body("enrollmentToken").isString().isLength({ min: 10, max: 4096 }),
  body("code").isString().matches(/^\d{6}$/).withMessage("Enter the 6-digit code from your authenticator app"),
  validate,
  userController.activateTwoFactor
);

router.post("/login/2fa",
  authLimiter,
  body("challengeToken").isString().isLength({ min: 10, max: 4096 }),
  body("code").optional().isString().matches(/^\d{6}$/).withMessage("Enter the 6-digit code from your authenticator app"),
  body("recoveryCode").optional().isString().isLength({ min: 8, max: 32 }),
  validate,
  userController.completeTwoFactorLogin
);

router.post("/2fa/setup", authUser, authLimiter, userController.setupTwoFactor);

router.post("/update", authUser,
    body("fullname.firstname").isString().trim().isLength({ min: 2, max: 80 }).withMessage("First name must be 2 to 80 characters").withMessage("First name must be 2 to 80 characters"),
    body("fullname.lastname").optional().isString().trim().isLength({ min: 1, max: 80 }).withMessage("Last name must be 1 to 80 characters"),
    body("phone").isString().matches(/^\d{10}$/).withMessage("Phone number must contain 10 digits"),
    validate,
    userController.updateUserProfile
);

router.get("/profile", authUser, userController.userProfile);

router.put("/saved-places",
    authUser,
    body("places").isArray({ max: 8 }),
    body("places.*.label").isString().trim().isLength({ min: 1, max: 30 }),
    body("places.*.address").isString().trim().isLength({ min: 3, max: 256 }),
    validate,
    userController.updateSavedPlaces
);

router.put("/emergency-contacts",
    authUser,
    body("contacts").isArray({ max: 3 }),
    body("contacts.*.name").isString().trim().isLength({ min: 1, max: 60 }),
    body("contacts.*.phone").isString().matches(/^\d{10}$/).withMessage("Phone number must contain 10 digits"),
    validate,
    userController.updateEmergencyContacts
);

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
