const Ticket = require("../models/ticketModel");
const Note = require("../models/noteModel");

const getNotes = async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId);

  if (ticket.user.toString() !== req.user.id) {
    res.status(401).json({ message: "User not authorized" });
  }

  const notes = await Note.find({ ticket: req.params.ticketId }).populate({
    path: "user",
    select: "name",
  });

  res.status(200).json(notes);
};

const addNote = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (ticket.user.toString() !== req.user.id) {
      res.status(401).json({ message: "User not authorized" });
    }
    const note = await Note.create({
      text: req.body.text,
      isStaff: false,
      ticket: req.params.ticketId,
      user: req.user.id,
    });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);

    if (ticket.user.toString() !== req.user.id) {
      res.status(401).json({ message: "User not authorized" });
    }
    const note = await Note.findByIdAndDelete(req.body.id);

    res.status(200).json("Successfully deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getNotes,
  deleteNote,
  addNote,
};
