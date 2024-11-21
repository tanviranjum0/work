const express = require("express");
const validateForm = require("../controllers/validateForm");
const pool = require("../db");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/login", (req, res) => {
  validateForm(req, res);
});
router.post("/register", async (req, res) => {
  validateForm(req, res);
  const existUser = await pool.query(
    "select username from users where username=$1",
    [req.body.username]
  );

  if (existUser.rowCount == 0) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // const newUser = {
    //   username: req.body.username,
    //   password: hashedPassword,
    // };
    const newuserQuery = await pool.query(
      "insert into user (username, passHash) values ($1, $2) returning username",
      [req.body.username, hashedPassword]
    );
    res.json({ loggedIn: true }, username);
  } else {
    res.status(400).json({ loggedIn: false, msg: "Username already exists" });
    return;
  }
});
module.exports = router;
