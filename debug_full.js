const mongoose = require("mongoose");
const Ticket = require("./backend/models/Ticket");
const Entry = require("./backend/models/Entry");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/smartlot").then(async () => {
    console.log("Connected");
    const entry = await Entry.findOne({ vehicleNumber: "TN09IO3456", exitTime: { $exists: false } });
    console.log("ACTIVE ENTRY:", entry);
    
    const tickets = await Ticket.find({ vehicleNumber: "TN09IO3456" });
    console.log("ALL TICKETS:", JSON.stringify(tickets, null, 2));
    
    process.exit();
});
