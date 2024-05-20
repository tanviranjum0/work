const express = require("express");
const publicRouter = express.Router();
const log = (req, res, next) => {
  console.log("I am logging Something");
  next();
};
publicRouter.param("user", (req, res, next, id) => {
  req.user = id;
  next();
});
publicRouter.get("/:user", (req, res) => {
  res.send(req.user);
});
publicRouter.get("/", (req, res) => {
  res.send("Home");
});
module.exports = publicRouter;
