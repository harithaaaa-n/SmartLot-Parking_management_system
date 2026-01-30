const mongoose = require('mongoose');
require('dotenv').config();
const Ticket = require('./models/Ticket');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        const datePrefix = `${dd}${mm}${yyyy}`;

        console.log(`Searching for tickets with prefix: ${datePrefix}`);

        const tickets = await Ticket.find({
            ticketNumber: { $regex: new RegExp(`^${datePrefix}-`) }
        }).sort({ ticketNumber: 1 });

        console.log("Found Tickets:");
        tickets.forEach(t => console.log(`- ${t.ticketNumber} (Vehicle: ${t.vehicleNumber}) (ID: ${t._id})`));

        const lastTicket = await Ticket.findOne({
            ticketNumber: { $regex: new RegExp(`^${datePrefix}-`) }
        }).sort({ ticketNumber: -1 });

        console.log("\nLast Ticket found by logic:");
        console.log(lastTicket ? lastTicket.ticketNumber : "None");

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
};

run();
