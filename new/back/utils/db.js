const mongoose = require("mongoose");

const db = async (url) => {
  await mongoose.connect(url).then(() => console.log("MongoDB connected..."));
};

module.exports = { db };
