const cluster = require("cluster");
const express = require("express");
const os = require("os");
const totalCpus = os.cpus().length;
// console.log(totalCpus);y

if (cluster.isPrimary) {
  for (i = 0; i < totalCpus; i++) {
    cluster.fork();
  }
} else {
  const app = express();
  app.get("/", (req, res) => {
    res.send(`${process.pid}`);
  });
  app.listen(8000, () => {
    console.log("Server started at port 8000");
  });
}
