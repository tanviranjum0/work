const Ticket = require("../models/ticketModel");
const Note = require("../models/noteModel");
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: "user",
        select: "-password",
      })
      .exec();
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTicket = async (req, res) => {
  const { seating, payment, description } = req.body;

  if (!seating || !payment || !description) {
    res.status(400).json({ message: "Please add a seating and description" });
  }

  try {
    const ticket = await Ticket.create({
      seating,
      payment,
      description,
      user: req.user.id,
      status: "new",
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const tick = await Ticket.findOne({ _id: req.params.id }).populate({
      path: "user",
      select: "_id",
    });
    if (tick.user._id == req.user.id) {
      const allNotes = await Note.deleteMany({ ticket: req.params.id });
      const ticket = await Ticket.findByIdAndDelete(req.params.id);
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });
      res.json({ message: "Ticket deleted successfully" });
    } else {
      res.status(403).json({ message: "Not authorized to delete this ticket" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401).json({ error: "Not Authorized" });
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedTicket);
};

module.exports = {
  updateTicket,
  deleteTicket,
  createTicket,
  getTickets,
  getTicket,
};
