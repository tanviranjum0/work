const {
  getListing,
  deleteListing,
  updateListing,
  createListing,
  getuserListings,
  getListings,
} = require("../handlers/listing");
const { uploadListingImage } = require("../handlers/upload");
const { rateLimit } = require("express-rate-limit");
const express = require("express");
const checkLogin = require("../middlewares/checkLogin");
const { checkOrigin } = require("../middlewares/checkOrigin");
const uploadImage = require("../middlewares/uploadImage");

const router = express.Router();
const listingUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 36,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, res) =>
    res.status(429).json({ message: "Too many image uploads. Please try again later." }),
});

router.post("/upload", checkOrigin, checkLogin, listingUploadLimiter, uploadImage.single("file"), uploadListingImage);
router.post("/create", checkOrigin, checkLogin, createListing);
router.delete("/delete/:id", checkOrigin, checkLogin, deleteListing);
router.post("/update/:id", checkOrigin, checkLogin, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);
router.get("/user-listings/:id", checkLogin, getuserListings);

module.exports = router;
