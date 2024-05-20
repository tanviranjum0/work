const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");
const app = express();
app.use(express.json());
dotenv.config();
mongoose
  .connect("mongodb://localhost/todos")
  .then(() => {
    console.log("Connection Sucessful");
  })
  .catch((err) => {
    console.log(err);
  });
app.use("/todos", todoHandler);
app.use("/user", userHandler);
app.get("/", (req, res) => {
  res.send("Hello");
});
function errHandler(err, req, res, next) {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}
app.use(errHandler);
app.listen(3000, () => {
  console.log("Server started at port 3000");
});
