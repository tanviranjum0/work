const express = require("express");
const path = require("path");
const multer = require("multer");
// const cookieParser = require("cookie-parser");
const app = express();
// const adminRouter = require("./adminRouter");
// const publicRouter = require("./publicRouter");
// app.use(cookieParser());
// const adminRouter = express.Router();

// const logger = (req, res, next) => {
//   console.log(
//     `${new Date(Date.now()).toLocaleString()} - ${req.method} - ${
//       req.originalUrl
//     } - ${req.ip}`
//   );
//   // throw new Error("Error");
//   next();
// };
// adminRouter.use(logger);
// app.use("/admin", adminRouter);
// adminRouter.get("/dashboard", (req, res) => {
//   res.send("Dashboard");
// });
// const errorMiddleware = (err, req, res, next) => {
//   console.log(err);
//   res.status(500).send("There was a server side Error");
// };
// adminRouter.use(errorMiddleware);
// app.use("/admin", adminRouter);
// app.use("/", publicRouter);
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, UPLOAD_PATH);
  },
  filename: (req, file, callback) => {
    //IMportant file.pdf
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    callback(null, fileName + fileExt);
  },
});
const UPLOAD_PATH = "./uploads/";
var upload = multer({
  storage,
  limits: {
    fileSize: 100000000, //1 MB
  },
  fileFilter: (req, file, callback) => {
    if (file.fieldname === "avatar") {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Only image Allowed"));
      }
    } else if (file.fieldname === "gallery") {
      if (file.mimetype === "application/pdf") {
        callback(null, true);
      } else {
        callback(new Error("Only pdf Allowed"));
      }
    } else {
    }
  },
});
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(500).send(err.message);
  } else {
    res.send("Success");
  }
});

const cpUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
]);
app.post("/", cpUpload, function (req, res, next) {
  console.log(req.files);
});
// app.use((err, req, res, next) => {
//   console.log(err);
//   res.status(300).send(err);
// });
app.listen(3000, () => {
  console.log("server started at port 3000");
});
