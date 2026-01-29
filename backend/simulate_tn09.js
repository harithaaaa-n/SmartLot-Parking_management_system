const mongoose = require("mongoose");
const Entry = require("./models/Entry");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
        const vehicleNum = "TN09AB9999";

        // 1. Create Entry
        console.log(`Creating Entry for ${vehicleNum}...`);
        await Entry.deleteMany({ vehicleNumber: vehicleNum }); // Clear old
        await Entry.create({
            vehicleNumber: vehicleNum,
            entryTime: new Date()
        });

        // 2. Search Logic (Exact copy from controller)
        const id = "TN09AB9999";
        const cleanId = id.trim();
        const regex = new RegExp(`^${cleanId}$`, "i");
        let entry = await Entry.findOne({
            vehicleNumber: { $regex: regex },
            exitTime: { $exists: false }
        });

        if (entry) {
            console.log("✅ EXACT MATCH SUCCESS");
        } else {
            console.log("❌ EXACT MATCH FAILED");
            // Fallback
            const fuzzyRegexStr = "^" + cleanId.split("").map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\s*").join("") + "$";
            const fuzzyRegex = new RegExp(fuzzyRegexStr, "i");
            entry = await Entry.findOne({
                vehicleNumber: { $regex: fuzzyRegex },
                exitTime: { $exists: false }
            });
            if (entry) {
                console.log("✅ FUZZY MATCH SUCCESS");
            } else {
                console.log("❌ FUZZY MATCH FAILED");
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
