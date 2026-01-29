const mongoose = require("mongoose");
const Entry = require("./models/Entry");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const vehicleNum = "TN09AB9999";
        console.log(`Checking status for ${vehicleNum}...`);

        const active = await Entry.findOne({
            vehicleNumber: { $regex: new RegExp(`^${vehicleNum}$`, "i") },
            exitTime: { $exists: false }
        });

        if (active) {
            console.log("✅ STATUS: Vehicle is CURRENTLY PARKED.");
            console.log(`   Entry Time: ${active.entryTime}`);
            console.log(`   Slot: ${active.slotId}`);
        } else {
            console.log("❌ STATUS: Vehicle is NOT parked (or checked out).");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
