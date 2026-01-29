const mongoose = require("mongoose");
const Ticket = require("./backend/models/Ticket");
const Entry = require("./backend/models/Entry");

mongoose.connect("mongodb://127.0.0.1:27017/smart_parking").then(async () => {
    console.log("Connected to smart_parking");
    const tickets = await Ticket.find({ vehicleNumber: "TN09IO3456" });
    console.log("ALL TICKETS:", JSON.stringify(tickets, null, 2));
    process.exit();
});
