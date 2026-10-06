const multer = require("multer");

const allowedMimeTypes = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
    fields: 0,
    parts: 1,
    fieldNameSize: 100,
  },
  fileFilter(_req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error("Choose a JPG, PNG, WebP, or AVIF image.");
      error.status = 400;
      return callback(error);
    }
    return callback(null, true);
  },
});

module.exports = uploadImage;
