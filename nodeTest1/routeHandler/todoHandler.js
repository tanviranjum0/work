const express = require("express");
const mongoose = require("mongoose");
const checkLogin = require("../middlewares/checkLogin");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");
const Todo = new mongoose.model("Todo", todoSchema);
//Get all the todos
router.get("/active", async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json(data);
});
router.get("/js", async (req, res) => {
  const data = await Todo.findByJS();
  res.status(200).json({ data });
});
router.get("/language", async (req, res) => {
  const data = await Todo.find().byLanguage("js");
  res.status(200).json({ data });
});
router.get("/active-callback", (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err, data) => {
    res.status(200).json({ data });
  });
  // res.status(200).json({ data });
});
router.get("/", checkLogin, async (req, res) => {
  try {
    const data = await Todo.find({})
      .populate("user", "name username -_id")
      .select({ _id: 0, _v: 0, date: 0 })
      .limit(2); // status: "active"
    res.status(200).json({
      result: data,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a Error",
    });
  }
  // res.send();
});
//Get a todos by ID
router.get("/:id", async (req, res) => {
  try {
    const data = await Todo.find({ _id: req.params.id });
    res.status(200).json({
      result: data,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a Error",
    });
  }
  // res.send(data);
});
//post todo
router.post("/", checkLogin, async (req, res) => {
  try {
    // console.log(req.userId);
    const newTodo = await new Todo({
      ...req.body,
      user: req.userId,
    });
    newTodo.save();
    res.send("Helo");
  } catch {
    res.status(404).json({
      error: "There is a error posting New Todo",
    });
  }
});
//post multiple todo
router.post("/all", (req, res) => {
  Todo.insertMany(req.body);
  res.send("Helo");
});
//put a todo
router.put("/:id", (req, res) => {
  Todo.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: "inactive",
      },
    }
  );
  res.send("Helo");
});
//delete a todo
router.delete("/:id", (req, res) => {
  Todo.deleteOne({ _id: req.params.id });
  res.send("Helo");
});
module.exports = router;
