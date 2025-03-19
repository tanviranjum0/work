const { getUserById } = require("../controllers/UserController.js");
const authorization = ([role]) => {
  return async function (req, res, next) {
    const user = await getUserById(req.user);
    if (user.role == role) {
      next();
    } else {
      res
        .status(400)
        .json({ message: "You are not allowed to manupulate data" });
    }
  };
};

module.exports = { authorization };
