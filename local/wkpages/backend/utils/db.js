const mongoose = require("mongoose");
const connectToDB = (url) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB!");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectToDB;
