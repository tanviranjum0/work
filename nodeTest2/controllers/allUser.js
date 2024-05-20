const User = require("../models/user");
async function handleGetAllUsers(req, res) {
  const allUsers = await User.find({});
  return res.json(allUsers);
}
async function handleGetUserById(req, res) {
  const id = await req.params.id;
  const userWithID = await User.findById(id);
  if (!userWithID) {
    res.status(400).json({ err: "There is a error" });
  } else {
    res.json(userWithID);
  }
}
async function handleUpdateUserById(req, res) {
  const id = await req.params.id;
  const userWithID = await User.findByIdAndUpdate(id, {
    lastName: "Changed",
  });
  if (!userWithID) {
    res.status(400).json({ err: "There is a error" });
  } else {
    res.json(userWithID);
  }
}
async function handleDeleteUserById(req, res) {
  const id = await req.params.id;
  const userWithID = await User.findByIdAndDelete(id);
  return res.status(200).json({ message: "Success" });
}
async function handleCreateNewUser(req, res) {
  const body = await req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  return res.status(200).json({ Message: "Success", id: result._id });
}
module.exports = {
  handleDeleteUserById,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleCreateNewUser,
};
