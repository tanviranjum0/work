const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const checkLogin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      // console.log(req.user);
      if (!req.user) {
        res.status(401).json({ error: "Not authirised1" });
      }

      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Not authorized2" });
    }
  } else {
    res.status(402).json({ message: "Authorization Failed" });
  }
};

module.exports = { checkLogin };
