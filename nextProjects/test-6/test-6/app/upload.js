import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), "public/uploads"),
    filename: (req, file, callback) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const originalExtension = path.extname(file.originalname);
      const newFileName = `${year}_${month}_${day}-${hours}h_${minutes}m_${seconds}s-${file.originalname}`;
      callback(null, newFileName);
    },
  }),
  limits: {
    fileSize: 1000 * 1024 * 1024, // 100MB limit
  },
});

export const config = {
  api: {
    bodyParser: false,
    timeout: 0,
  },
};

export default async function handler(req, res) {
  await upload.single("image")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      // Multer error occurred
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Error uploading file" });
    } else if (error) {
      // Other error occurred
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Error uploading file" });
    } else {
      // File uploaded successfully
      res.status(200).json({ message: "File uploaded successfully" });
    }
  });
}
