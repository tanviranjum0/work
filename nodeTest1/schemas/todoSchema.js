const mongoose = require("mongoose");
const todoSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User", //Model Name
  },
});
//Instance Method
todoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo").find({ status: "active" });
  },
  findActiveCallback: function (cb) {
    return mongoose.model("Todo").find({ status: "active" }, cb);
  },
};
//Static method
todoSchema.statics = {
  findByJS: function () {
    return this.find({ title: /js/i });
  },
};
//Query Helpers method
todoSchema.query = {
  byLanguage: function (language) {
    return this.find({ title: new RegExp(language, "i") });
  },
};
module.exports = todoSchema;
