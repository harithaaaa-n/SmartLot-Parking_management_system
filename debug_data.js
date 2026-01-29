const mongoose = require("mongoose");
const Ticket = require("./backend/models/Ticket");
const Entry = require("./backend/models/Entry");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/smartlot").then(async () => {
    console.log("Connected");
    console.log("--- ENTRIES ---");
    const entries = await Entry.find({ vehicleNumber: "TN09IO3456" });
    console.log(entries);
    console.log("--- RECENT TICKETS ---");
    const tickets = await Ticket.find().sort({_id:-1}).limit(5);
    console.log(tickets);
    process.exit();
});
