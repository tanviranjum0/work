const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const token = req.signedCookies?.access_token;
  if (!token) return res.status(401).json({ message: "Authentication required." });
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Authentication is not configured." });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (typeof user !== "object" || !user.id || !Number.isFinite(user.exp)) {
      return res.status(401).json({ message: "Authentication required." });
    }
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Authentication required." });
  }
};

module.exports = checkLogin;
