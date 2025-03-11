const jwt = require("jsonwebtoken");
const checkLogin = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization;
  }
  if (!token) return res.json("error logging in");
  console.log(token);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.json("Couldn't verify User");
    req.user = user;
    console.log(req.user);
  });
  next();
};
module.exports = checkLogin;
