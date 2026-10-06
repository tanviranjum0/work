const cloudinary = require("cloudinary").v2;

const hasValidImageSignature = (buffer, mimeType) => {
  if (mimeType === "image/jpeg") {
    return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (mimeType === "image/webp") {
    return buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  }
  if (mimeType === "image/avif") {
    return buffer.toString("ascii", 4, 8) === "ftyp" &&
      ["avif", "avis"].includes(buffer.toString("ascii", 8, 12));
  }
  return false;
};

const uploadImage = (buffer, folder) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          allowed_formats: ["avif", "jpg", "jpeg", "png", "webp"],
          unique_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          return resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      )
      .end(buffer);
  });

const uploadAvatar = async (req, res) => {
  if (!req.file || !hasValidImageSignature(req.file.buffer, req.file.mimetype)) {
    return res.status(400).json({ message: "Choose a valid image file." });
  }
  try {
    const avatar = await uploadImage(req.file.buffer, "fullestate/avatars");
    return res.status(201).json(avatar);
  } catch {
    return res.status(502).json({ message: "Unable to upload the profile image." });
  }
};

const uploadListingImage = async (req, res) => {
  if (!req.file || !hasValidImageSignature(req.file.buffer, req.file.mimetype)) {
    return res.status(400).json({ message: "Choose a valid image file." });
  }
  try {
    const image = await uploadImage(
      req.file.buffer,
      "fullestate/listings/" + req.user.id
    );
    return res.status(201).json(image);
  } catch {
    return res.status(502).json({ message: "Unable to upload the property image." });
  }
};

module.exports = { uploadAvatar, uploadListingImage };
