const express = require("express");
const router = express.Router();
const { checkLogin } = require("../utils/checkLogin");
const {
  getTickets,
  getTicket,
  createTicket,
  deleteTicket,
  updateTicket,
} = require("../controllers/ticketController");

const noteRouter = require("./noteRoute");

router.use("/notes", noteRouter);
router.route("/").get(checkLogin, getTickets).post(checkLogin, createTicket);
router
  .route("/:id")
  .get(checkLogin, getTicket)
  .delete(checkLogin, deleteTicket)
  .put(checkLogin, updateTicket);

module.exports = router;
