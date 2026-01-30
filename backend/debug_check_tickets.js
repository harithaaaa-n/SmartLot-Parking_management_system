const mongoose = require('mongoose');

const uri = "mongodb+srv://parking_admin:Srinithesh%4020@cluster0.htdynx1.mongodb.net/smart_parking";

const ticketSchema = new mongoose.Schema({
    ticketNumber: { type: String, unique: true },
    vehicleNumber: String,
    entryTime: Date,
    status: { type: String, default: "Active" }
});

const Ticket = mongoose.model("Ticket", ticketSchema, "tickets"); // Ensure using 'tickets' collection

const run = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(uri);
        console.log("Connected.");

        console.log("Fetching ALL tickets (limited to 20, sorted -ticketNumber)...");
        const tickets = await Ticket.find().sort({ ticketNumber: -1 }).limit(20);

        console.log(`Found ${tickets.length} tickets.`);
        tickets.forEach(t => {
            console.log(`- Ticket: '${t.ticketNumber}', Vehicle: '${t.vehicleNumber}', Entry: ${t.entryTime}`);
        });

        // Test the exact query logic used in controller
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        const datePrefix = `${dd}${mm}${yyyy}`;
        console.log(`\nTesting Logic for datePrefix: '${datePrefix}'`);

        const lastTicket = await Ticket.findOne({
            ticketNumber: { $regex: new RegExp(`^${datePrefix}-`) }
        }).sort({ ticketNumber: -1 });

        console.log("Controller Logic Results:");
        if (lastTicket) {
            console.log("Found lastTicket:", lastTicket.ticketNumber);
        } else {
            console.log("lastTicket NOT FOUND. Code would start at 0001.");
        }

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        await mongoose.disconnect();
        console.log(" disconnected.");
    }
};

run();
