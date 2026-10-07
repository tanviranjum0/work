const express = require("express");
const router = express.Router();
const captainController = require("../controllers/captain.controller");
const { body } = require("express-validator");
const { authCaptain } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

module.exports = ({ authLimiter, verificationLimiter }) => {
router.post("/register",
    authLimiter,
    body("email").isEmail().toLowerCase().withMessage("Invalid email"),
    body("password").isString().isLength({ min: 8 }).isByteLength({ max: 72 }),
    body("phone").isString().matches(/^\d{10}$/).withMessage("Phone number must contain 10 digits"),
    body("fullname.firstname").isString().trim().isLength({ min: 2, max: 80 }).withMessage("First name must be 2 to 80 characters").withMessage("First name must be 2 to 80 characters"),
    body("fullname.lastname").optional().isString().trim().isLength({ max: 80 }).withMessage("Last name is too long"),
    body("vehicle.color").isString().trim().isLength({ min: 3, max: 40 }).withMessage("Vehicle colour must be 3 to 40 characters"),
    body("vehicle.number").isString().trim().isLength({ min: 3, max: 32 }).withMessage("Plate number must be 3 to 32 characters"),
    body("vehicle.capacity").isInt({ min: 1, max: 20 }).toInt().withMessage("Seats must be between 1 and 20"),
    body("vehicle.type").isIn(["car", "bike", "auto"]),
    validate,
    captainController.registerCaptain
);

router.post("/verify-email",
    verificationLimiter,
    body("token").isString().isLength({ min: 1, max: 4096 }),
    validate,
    captainController.verifyEmail
);

router.post("/login",
    authLimiter,
    body("email").isEmail().toLowerCase().withMessage("Invalid email"),
    body("password").isString().isLength({ min: 8 }).isByteLength({ max: 72 }),
    validate,
    captainController.loginCaptain
);


router.post("/2fa/activate",
  authLimiter,
  body("enrollmentToken").isString().isLength({ min: 10, max: 4096 }),
  body("code").isString().matches(/^\d{6}$/).withMessage("Enter the 6-digit code from your authenticator app"),
  validate,
  captainController.activateTwoFactor
);

router.post("/login/2fa",
  authLimiter,
  body("challengeToken").isString().isLength({ min: 10, max: 4096 }),
  body("code").optional().isString().matches(/^\d{6}$/).withMessage("Enter the 6-digit code from your authenticator app"),
  body("recoveryCode").optional().isString().isLength({ min: 8, max: 32 }),
  validate,
  captainController.completeTwoFactorLogin
);

router.post("/2fa/setup", authCaptain, authLimiter, captainController.setupTwoFactor);

router.post("/update", 
    authCaptain,
    body("captainData.phone").optional().isString().matches(/^\d{10}$/),
    body("captainData.fullname.firstname").optional().isString().trim().isLength({ min: 2, max: 80 }),
    body("captainData.fullname.lastname").optional().isString().trim().isLength({ min: 2, max: 80 }),
    body("captainData.vehicle.color").optional().isString().trim().isLength({ min: 3, max: 40 }),
    body("captainData.vehicle.number").optional().isString().trim().isLength({ min: 3, max: 32 }),
    body("captainData.vehicle.capacity").optional().isInt({ min: 1, max: 20 }).toInt(),
    body("captainData.vehicle.type").optional().isIn(["car", "bike", "auto"]),
    validate,
    captainController.updateCaptainProfile
);

router.get("/profile", authCaptain, captainController.captainProfile);

router.patch("/status",
    authCaptain,
    body("status").isIn(["active", "inactive"]).withMessage("Status must be active or inactive"),
    validate,
    captainController.setStatus
);

router.get("/earnings", authCaptain, captainController.earnings);

router.post("/logout", authCaptain, captainController.logoutCaptain);

router.post(
    "/reset-password",
    verificationLimiter,
    body("token").isString().isLength({ min: 1, max: 4096 }),
    body("password").isString().isLength({ min: 8 }).isByteLength({ max: 72 }),
    validate,
    captainController.resetPassword
);

return router;
};
