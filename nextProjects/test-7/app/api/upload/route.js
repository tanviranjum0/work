import multer from "multer";
import path from "path";
import { NextResponse } from "next/server";

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
      const newFileName = `${year}_${month}_${day}-${hours}h_${minutes}m_${seconds}s-${file.originalname}.${originalExtension}`;
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

export async function POST(req, res) {
  const formData = await req.formData();

  const file = formData.get("file");
  console.log(file);
  await upload.single("image")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      // Multer error occurred
      console.log("Error uploading file:", error);
      NextResponse.json({ error: "Error uploading file" });
    } else if (error) {
      // Other error occurred
      console.log("Error uploading file:", error);
      NextResponse.json({ error: "Error uploading file" });
    } else {
      // File uploaded successfully
      NextResponse.json({ message: "File uploaded successfully" });
    }
  });
}
