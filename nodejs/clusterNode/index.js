const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send(`${process.pid}`);
});
app.listen(8000, () => {
  console.log("Server started at port 8000");
});
