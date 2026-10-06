const User = require("../models/user");
const Listing = require("../models/listing");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const { cleanText, emailPattern, getCloudinaryAsset } = require("../utils/validation");

const deleteCloudinaryAssets = async (assets) => {
  const publicIds = assets
    .map(getCloudinaryAsset)
    .filter(Boolean)
    .map((asset) => asset.public_id);
  for (let index = 0; index < publicIds.length; index += 100) {
    await cloudinary.api.delete_resources(publicIds.slice(index, index + 100));
  }
};

const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: "You can only update your own account." });
  }

  const updates = {};
  if (req.body?.username !== undefined) {
    const username = cleanText(req.body.username, 40);
    if (username.length < 2) {
      return res.status(400).json({ message: "Enter a valid username." });
    }
    updates.username = username;
  }
  if (req.body?.email !== undefined) {
    const email = cleanText(req.body.email, 254).toLowerCase();
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    updates.email = email;
  }
  if (req.body?.password !== undefined) {
    if (
      typeof req.body.password !== "string" ||
      req.body.password.length < 12 ||
      Buffer.byteLength(req.body.password, "utf8") > 72
    ) {
      return res.status(400).json({ message: "Use a password between 12 and 72 bytes." });
    }
    updates.password = req.body.password;
  }
  if (req.body?.avatar !== undefined) {
    const avatar = getCloudinaryAsset(req.body.avatar, "fullestate/avatars");
    if (!avatar) return res.status(400).json({ message: "Choose a valid profile image." });
    updates.avatar = avatar;
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid account details were provided." });
  }

  try {
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, {
      new: true,
      runValidators: true,
    }).select("username email avatar");
    if (!user) return res.status(404).json({ message: "Account not found." });
    return res.status(200).json({ user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Unable to use those account details." });
    }
    return res.status(400).json({ message: "Unable to update the account." });
  }
};

const deleteUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: "You can only delete your own account." });
  }

  try {
    const [user, userListings] = await Promise.all([
      User.findById(req.params.id).select("_id"),
      Listing.find({ userRef: req.params.id }).select("imageUrls"),
    ]);
    if (!user) return res.status(404).json({ message: "Account not found." });

    const assets = userListings.flatMap((listing) => listing.imageUrls || []);
    await deleteCloudinaryAssets(assets);
    await Listing.deleteMany({ userRef: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token", {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json({ message: "Account deleted." });
  } catch {
    return res.status(500).json({ message: "Unable to delete the account right now." });
  }
};

const getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ userRef: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .skip(Math.max(0, Math.min(Number.parseInt(req.query.startIndex, 10) || 0, 10000)));
    return res.status(200).json(listings);
  } catch {
    return res.status(500).json({ message: "Unable to load account listings." });
  }
};

const getUser = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const user = mongoose.isValidObjectId(identifier)
      ? await User.findById(identifier).select("username email avatar")
      : await User.findOne({ email: cleanText(identifier, 254).toLowerCase() }).select("username email avatar");
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.status(200).json(user);
  } catch {
    return res.status(500).json({ message: "Unable to load the user." });
  }
};

module.exports = { deleteUser, getUser, getUserListings, updateUser };
