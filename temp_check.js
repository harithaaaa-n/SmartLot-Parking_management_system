const mongoose = require("mongoose");
const Ticket = require("./backend/models/Ticket");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const tickets = await Ticket.find().sort({ _id: -1 }).limit(2);
  console.log("Last 2 Tickets:");
  tickets.forEach(t => console.log(t.ticketNumber));
  process.exit();
});
