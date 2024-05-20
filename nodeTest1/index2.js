const express = require("express");
// const ejs = require("ejs");
const app = express();
app.set("view engine", "ejs");
// const router = express.Router();
// app.use(router);
// router
//   .route("/")
app.get("/test", (req, res) => {
  res.send("Helloo World");
});
app.get("/", (req, res) => {
  res.set("name:", "Tanvir");
  // res.json({
  //   name: "Bangladesh",
  // });
  // res.sendStatus(403);
  // res.end();
  // res.location("/test");
  res.redirect("/test");
  // res.cookie("name", "Bangladesh");
  res.end();
});
app.post("/", (req, res) => {
  res.send("Welcome to Home Post");
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
