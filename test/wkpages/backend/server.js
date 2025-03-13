const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoutes.js");
const blogRoute = require("./routes/blogRoutes.js");
const commentRoute = require("./routes/blogCommentRoutes.js");
const dotenv = require("dotenv");
const connectToDB = require("./utils/db.js");

const app = express();

dotenv.config();
connectToDB(process.env.MONGO_URL);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ["http://127.0.0.1:5500"],
  })
);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRoute);
app.use("/api/blog", blogRoute);
app.use("/api/comment", commentRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.listen(3000, () => console.log("server running on port 3000"));
