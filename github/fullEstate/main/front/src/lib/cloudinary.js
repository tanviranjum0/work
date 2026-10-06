const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const optimizeCloudinaryImage = (imageUrl, width = 720) => {
  if (typeof imageUrl !== "string") return "";
  try {
    const image = new URL(imageUrl);
    if (image.protocol !== "https:" || image.hostname !== "res.cloudinary.com") return imageUrl;
    const uploadPath = "/image/upload/";
    if (!image.pathname.includes(uploadPath)) return imageUrl;
    const targetWidth = Math.max(1, Math.min(2400, Math.round(Number(width) || 720)));
    image.pathname = image.pathname.replace(
      uploadPath,
      `${uploadPath}f_auto,q_auto,c_limit,w_${targetWidth}/`
    );
    return image.toString();
  } catch {
    return imageUrl;
  }
};

export const validateImageFile = (file) => {
  if (!file || !ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Choose a valid JPG, PNG, WebP, or AVIF image file.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Each image must be 2 MB or smaller.");
  }
};

export const uploadImage = async (file, endpoint = "/api/listing/upload") => {
  validateImageFile(file);
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok || !data.secure_url || !data.public_id) {
    throw new Error(data.message || "Image upload failed. Please try again.");
  }
  return data;
};

export const uploadImages = async (files) => {
  if (!files.length || files.length > 6) {
    throw new Error("Choose between one and six images.");
  }
  files.forEach(validateImageFile);
  return Promise.all(files.map((file) => uploadImage(file)));
};
