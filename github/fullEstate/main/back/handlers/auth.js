const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { cleanText, emailPattern, getCloudinaryAsset } = require("../utils/validation");

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const cookieOptions = () => ({
  httpOnly: true,
  signed: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_DURATION_MS,
});

const clearSessionCookie = (res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

const checkIfAlreadyLoggedIn = async (req, res) => {
  const token = req.signedCookies?.access_token;
  if (!token || !process.env.JWT_SECRET) {
    clearSessionCookie(res);
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (typeof payload !== "object" || !payload.id || !Number.isFinite(payload.exp)) {
      throw new Error("Invalid session");
    }
    const user = await User.findById(payload.id).select("username email avatar");
    if (!user) throw new Error("Invalid session");
    return res.status(200).json({
      userObject: { name: user.username, email: user.email, id: user._id.toString() },
      avatar: user.avatar || null,
    });
  } catch {
    clearSessionCookie(res);
    return res.status(401).json({ message: "Authentication required." });
  }
};

const signup = async (req, res) => {
  const username = cleanText(req.body?.username, 40);
  const email = cleanText(req.body?.email, 254).toLowerCase();
  const password = req.body?.password;
  const avatar = getCloudinaryAsset(req.body?.avatar, "fullestate/avatars");

  if (
    username.length < 2 ||
    !emailPattern.test(email) ||
    typeof password !== "string" ||
    password.length < 12 ||
    Buffer.byteLength(password, "utf8") > 72 ||
    !avatar
  ) {
    return res.status(400).json({
      message: "Enter a valid name, email, password, and profile image.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashedPassword, avatar });
    return res.status(201).json({
      userObject: { name: user.username, email: user.email, id: user._id.toString() },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Unable to create an account with those details." });
    }
    return res.status(400).json({ message: "Unable to create the account." });
  }
};

const login = async (req, res) => {
  const email = cleanText(req.body?.email, 254).toLowerCase();
  const password = req.body?.password;
  if (!emailPattern.test(email) || typeof password !== "string" || password.length > 72) {
    return res.status(400).json({ message: "Enter a valid email and password." });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy");
    if (!user || !passwordMatches) {
      console.warn("Failed login attempt", { ip: req.ip });
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const userObject = {
      name: user.username,
      email: user.email,
      id: user._id.toString(),
    };
    const token = jwt.sign(userObject, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    return res
      .cookie("access_token", token, cookieOptions())
      .status(200)
      .json({ userObject, avatar: user.avatar || null, status: "Login successfully!" });
  } catch {
    return res.status(500).json({ message: "Unable to sign in right now." });
  }
};

const signOut = (req, res) => {
  clearSessionCookie(res);
  return res.status(200).json({ message: "Signed out." });
};

module.exports = { signup, checkIfAlreadyLoggedIn, login, signOut };
