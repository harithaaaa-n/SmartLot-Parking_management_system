const mongoose = require("mongoose");
const Ticket = require("./backend/models/Ticket");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/smartlot").then(async () => {
    console.log("Connected");
    const tickets = await Ticket.find({ vehicleNumber: "TN09IO3456" });
    console.log(tickets);
    process.exit();
});
