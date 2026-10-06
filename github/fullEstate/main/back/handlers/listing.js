const Listing = require("../models/listing");
const cloudinary = require("cloudinary").v2;
const { getCloudinaryAsset, validateListing } = require("../utils/validation");

const parseBooleanFilter = (value) => {
  if (value === "true") return true;
  return undefined;
};

const escapeRegex = (value) => value.replace(/[.*+?^$()|[\]{}\\]/g, "\\$&");

const deleteCloudinaryAssets = async (assets) => {
  const publicIds = assets
    .map(getCloudinaryAsset)
    .filter(Boolean)
    .map((asset) => asset.public_id);
  if (publicIds.length) await cloudinary.api.delete_resources(publicIds);
};

const createListing = async (req, res) => {
  const validated = validateListing(req.body, req.user.id);
  if (validated.error) return res.status(400).json({ message: validated.error });
  try {
    const listing = await Listing.create({
      ...validated.data,
      userRef: req.user.id,
    });
    return res.status(201).json(listing);
  } catch {
    return res.status(400).json({ message: "Unable to create this listing." });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found." });
    if (req.user.id !== listing.userRef.toString()) {
      return res.status(403).json({ message: "You can only delete your own listings." });
    }
    await deleteCloudinaryAssets(listing.imageUrls || []);
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Listing deleted." });
  } catch {
    return res.status(500).json({ message: "Unable to delete this listing right now." });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found." });
    if (req.user.id !== listing.userRef.toString()) {
      return res.status(403).json({ message: "You can only update your own listings." });
    }
    const validated = validateListing(req.body, req.user.id, listing.imageUrls || []);
    if (validated.error) return res.status(400).json({ message: validated.error });

    const oldAssets = listing.imageUrls || [];
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: validated.data },
      { new: true, runValidators: true }
    );
    const retainedIds = new Set(validated.data.imageUrls.map((asset) => asset.public_id));
    const removedAssets = oldAssets.filter((asset) => !retainedIds.has(asset.public_id));
    if (removedAssets.length) {
      try {
        await deleteCloudinaryAssets(removedAssets);
      } catch {
        console.error("Could not remove superseded listing images.");
      }
    }
    return res.status(200).json(updatedListing);
  } catch {
    return res.status(500).json({ message: "Unable to update this listing right now." });
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found." });
    return res.status(200).json(listing);
  } catch {
    return res.status(400).json({ message: "Invalid listing identifier." });
  }
};

const getListings = async (req, res) => {
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const requestedStart = Number.parseInt(req.query.startIndex, 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(requestedLimit, 24))
    : 9;
  const startIndex = Number.isFinite(requestedStart)
    ? Math.max(0, Math.min(requestedStart, 10000))
    : 0;
  const type = ["sale", "rent"].includes(req.query.type) ? req.query.type : undefined;
  const offer = parseBooleanFilter(req.query.offer);
  const furnished = parseBooleanFilter(req.query.furnished);
  const parking = parseBooleanFilter(req.query.parking);
  const sortField = ["createdAt", "regularPrice", "name"].includes(req.query.sort)
    ? req.query.sort
    : "createdAt";
  const sortOrder = req.query.order === "asc" ? 1 : -1;
  const searchTerm = typeof req.query.searchTerm === "string"
    ? req.query.searchTerm.trim().slice(0, 80)
    : "";

  const query = {};
  if (type) query.type = type;
  if (offer !== undefined) query.offer = offer;
  if (furnished !== undefined) query.furnished = furnished;
  if (parking !== undefined) query.parking = parking;
  if (searchTerm) {
    const escapedTerm = escapeRegex(searchTerm);
    query.$or = [
      { name: { $regex: escapedTerm, $options: "i" } },
      { address: { $regex: escapedTerm, $options: "i" } },
    ];
  }

  try {
    const listings = await Listing.find(query)
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(startIndex)
      .lean();
    return res.status(200).json(listings);
  } catch {
    return res.status(500).json({ message: "Unable to load listings." });
  }
};

const getuserListings = async (req, res) => {
  if (req.params.id !== req.user.id) {
    return res.status(403).json({ message: "You can only view your own listings." });
  }
  try {
    const startIndex = Math.max(
      0,
      Math.min(Number.parseInt(req.query.startIndex, 10) || 0, 10000)
    );
    const listings = await Listing.find({ userRef: req.user.id })
      .limit(10)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .lean();
    return res.status(200).json(listings);
  } catch {
    return res.status(500).json({ message: "Unable to load account listings." });
  }
};

module.exports = {
  getuserListings,
  getListing,
  deleteListing,
  updateListing,
  createListing,
  getListings,
};
