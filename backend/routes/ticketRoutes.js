const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

router.get("/all", async (req, res) => {
  const tickets = await Ticket.find();
  res.json(tickets);
});

router.get("/:ticketNumber", async (req, res) => {
  const ticket = await Ticket.findOne({ ticketNumber: req.params.ticketNumber });
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }
  res.json(ticket);
});

module.exports = router;
