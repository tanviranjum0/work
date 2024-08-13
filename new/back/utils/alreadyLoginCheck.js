const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const alreadyLoginCheck = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        res.status(402).json({ error: "You are already logged in" });
      } else {
        next();
      }
    } catch (error) {
      next();
    }
  }
};

module.exports = { alreadyLoginCheck };
