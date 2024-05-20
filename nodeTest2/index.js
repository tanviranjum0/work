const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const router = require("./routes/user");
const connectMongoDB = require("./connection");
const app = express();
app.use(express.urlencoded({ extended: false }));

//mongoDB Connection
connectMongoDB("mongodb://localhost:27017/youtube-app-1");

app.set("view engine", "ejs");
//Routes
app.use("/users", router);
app.get("/", (req, res) => {
  res.render("main", { name: "Tanvir" });
});
app.listen(3000, () => {
  console.log("Server Started at port 3000");
});
