const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const publicIdPattern = /^[A-Za-z0-9_./-]{1,255}$/;

const cleanText = (value, maxLength) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const getCloudinaryAsset = (asset, expectedFolder) => {
  if (!asset || typeof asset !== "object" || Array.isArray(asset)) return null;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const publicId = asset.public_id;
  if (!cloudName || typeof publicId !== "string" || !publicIdPattern.test(publicId)) {
    return null;
  }

  try {
    const imageUrl = new URL(asset.secure_url);
    const uploadPrefix = "/" + cloudName + "/image/upload/";
    if (
      imageUrl.protocol !== "https:" ||
      imageUrl.hostname !== "res.cloudinary.com" ||
      !imageUrl.pathname.startsWith(uploadPrefix)
    ) {
      return null;
    }
    const pathParts = imageUrl.pathname.slice(uploadPrefix.length).split("/");
    const versionIndex = pathParts.findIndex((part) => /^v\d+$/.test(part));
    if (versionIndex < 0 || versionIndex === pathParts.length - 1) return null;
    const urlPublicId = decodeURIComponent(pathParts.slice(versionIndex + 1).join("/"))
      .replace(/\.[a-z0-9]+$/i, "");
    if (
      urlPublicId !== publicId ||
      (expectedFolder && !publicId.startsWith(expectedFolder + "/"))
    ) {
      return null;
    }
    return { secure_url: imageUrl.toString(), public_id: publicId };
  } catch {
    return null;
  }
};

const validateListing = (body, userId, existingAssets = []) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Listing details are invalid." };
  }

  const name = cleanText(body.name, 100);
  const description = cleanText(body.description, 5000);
  const address = cleanText(body.address, 200);
  const type = body.type;
  const bedrooms = Number(body.bedrooms);
  const bathrooms = Number(body.bathrooms);
  const regularPrice = Number(body.regularPrice);
  const discountPrice = Number(body.discountPrice);
  const booleansAreValid = ["offer", "parking", "furnished"].every(
    (field) => typeof body[field] === "boolean"
  );
  const existingIds = new Set(existingAssets.map((asset) => asset.public_id));
  const ownerFolder = "fullestate/listings/" + userId;
  const imageUrls = Array.isArray(body.imageUrls)
    ? body.imageUrls.map((asset) => {
        const ownedAsset = getCloudinaryAsset(asset, ownerFolder);
        if (ownedAsset) return ownedAsset;
        return existingIds.has(asset?.public_id) ? getCloudinaryAsset(asset) : null;
      })
    : [];

  if (name.length < 3 || description.length < 10 || address.length < 3) {
    return { error: "Add a name, description, and address for the property." };
  }
  if (type !== "sale" && type !== "rent") {
    return { error: "Choose whether the property is for sale or rent." };
  }
  if (
    !Number.isInteger(bedrooms) ||
    bedrooms < 1 ||
    bedrooms > 20 ||
    !Number.isInteger(bathrooms) ||
    bathrooms < 1 ||
    bathrooms > 20
  ) {
    return { error: "Bedroom and bathroom counts must be between 1 and 20." };
  }
  if (
    !Number.isFinite(regularPrice) ||
    regularPrice < 1 ||
    regularPrice > 100000000 ||
    !Number.isFinite(discountPrice) ||
    discountPrice < 0 ||
    discountPrice > regularPrice
  ) {
    return { error: "Enter valid property prices." };
  }
  if (!booleansAreValid) return { error: "Property features are invalid." };
  if (
    imageUrls.length === 0 ||
    imageUrls.length > 6 ||
    imageUrls.some((asset) => !asset)
  ) {
    return { error: "Add between one and six valid property images." };
  }

  return {
    data: {
      name,
      description,
      address,
      type,
      bedrooms,
      bathrooms,
      regularPrice,
      discountPrice,
      offer: body.offer,
      parking: body.parking,
      furnished: body.furnished,
      imageUrls,
    },
  };
};

module.exports = { cleanText, emailPattern, getCloudinaryAsset, validateListing };
