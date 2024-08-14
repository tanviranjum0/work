const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signup = async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;
  const existuser = await User.findOne({ email });
  if (existuser) {
    return res.status(400).json({ message: "Email already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const newUser = await User.findOne({ email });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({ token, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token, message: "Login Successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logOut = async (req, res) => {
  const { password } = req.body;
  const user = await User.findOne(req.user._id);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  } else {
    res.json({ message: "Logout Successful" });
  }
};
const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login, logOut, getMe };
