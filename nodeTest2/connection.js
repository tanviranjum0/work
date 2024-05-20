const mongoose = require("mongoose");
async function connectMongoDB(url) {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("MongoDB Started");
    })
    .catch((err) => {
      console.log("Error connecting mongoDB", err);
    });
}
module.exports = connectMongoDB;
