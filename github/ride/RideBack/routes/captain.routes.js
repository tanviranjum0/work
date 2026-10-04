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
    body("phone").isString().matches(/^\d{10}$/),
    body("fullname.firstname").isString().trim().isLength({ min: 3, max: 80 }),
    body("fullname.lastname").optional().isString().trim().isLength({ max: 80 }),
    body("vehicle.color").isString().trim().isLength({ min: 3, max: 40 }),
    body("vehicle.number").isString().trim().isLength({ min: 3, max: 32 }),
    body("vehicle.capacity").isInt({ min: 1, max: 20 }).toInt(),
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
