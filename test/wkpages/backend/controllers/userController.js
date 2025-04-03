const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleCreateUser = async (req, res) => {
  const { username, password, email, avatar, fullname } = await req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      username,
      avatar,
      fullname,
      password: hashedPassword,
      email,
    });
    userObject = {
      email,
      id: user._id,
    };

    const token = jwt.sign(userObject, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res
      .status(201)
      .json({ user, token, message: "User created successfully!" });
  } catch {
    res.status(200).json({ message: "User Creating Problem" });
  }
};

const handleLoginUser = async (req, res) => {
  const { password, email } = await req.body;
  const validUser = await User.findOne({ email });
  if (!validUser) {
    res.status(200).json({ message: "No user found .." });
    return;
  }
  const validPassword = await bcrypt.compare(password, validUser.password);

  if (!validPassword) {
    await res.status(200).json({ message: "Wrong Credentials" });
    return;
  }
  try {
    userObject = {
      email,
      id: validUser._id,
    };
    const token = jwt.sign(userObject, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({ validUser, token, message: "Login successfully!" });
  } catch {
    res.status(200).json({ message: "Login Problem" });
  }
};

const getUser = async (req, res) => {
  const { email, username } = req.body;
  const existUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existUser) {
    res
      .status(200)
      .json({ message: "This email or username already existed." });
    return;
  } else {
    res.status(200).json(null);
  }
};
const getUserById = async (user) => {
  const validUser = await User.findOne({ _id: user.id });
  return validUser;
};
module.exports = { getUserById, handleCreateUser, handleLoginUser, getUser };
