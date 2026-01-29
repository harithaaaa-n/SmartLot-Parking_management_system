const mongoose = require("mongoose");
const Entry = require("./models/Entry");
const Ticket = require("./models/Ticket");
const Slot = require("./models/Slot");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const vehicleNum = "TN09AB9999";
        console.log(`Force Deleting records for ${vehicleNum}...`);

        // 1. Delete Entries
        const entryResult = await Entry.deleteMany({ vehicleNumber: { $regex: new RegExp(`^${vehicleNum}$`, "i") } });
        console.log(`Deleted ${entryResult.deletedCount} Entries.`);

        // 2. Delete Tickets
        const ticketResult = await Ticket.deleteMany({ vehicleNumber: { $regex: new RegExp(`^${vehicleNum}$`, "i") } });
        console.log(`Deleted ${ticketResult.deletedCount} Tickets.`);

        // 3. Free up any slots that were occupied by this vehicle (Cleanup)
        // This is tricky if we don't know the exact slot, but we can reset all slots to Available if we want a full reset, or just leave it.
        // Safer: Find slots that are Occupied but have no corresponding active Entry.
        // For now, I will just log.
        console.log("Done. Vehicle data wiped.");

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
