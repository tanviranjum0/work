const express = require("express");
const router = express.Router();

const { checkLogin } = require("../utils/checkLogin");
const {
  getNotes,
  addNote,
  deleteNote,
} = require("../controllers/noteController");

router
  .route("/:ticketId")
  .get(checkLogin, getNotes)
  .post(checkLogin, addNote)
  .delete(checkLogin, deleteNote);

module.exports = router;
