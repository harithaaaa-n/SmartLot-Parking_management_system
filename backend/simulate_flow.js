const mongoose = require("mongoose");
const Entry = require("./models/Entry");
const Slot = require("./models/Slot");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Create Mock Entry
        const vehicleNum = "TEST-TN09";
        console.log(`Creating Entry for ${vehicleNum}...`);

        // Cleanup old test
        await Entry.deleteMany({ vehicleNumber: vehicleNum });

        const entry = await Entry.create({
            vehicleNumber: vehicleNum,
            entryTime: new Date(),
            // No exitTime
        });
        console.log(`Entry Created: ID=${entry._id}, VB=${entry.vehicleNumber}`);

        // 2. Simulate Search Logic (copied from controller)
        const id = vehicleNum; // Simulating user input
        const cleanId = id.trim();
        let searchRegex = new RegExp(`^${cleanId}$`, "i");

        console.log(`Searching with Regex: ${searchRegex}`);
        let found = await Entry.findOne({
            vehicleNumber: { $regex: searchRegex },
            exitTime: { $exists: false }
        });

        if (found) {
            console.log("✅ SUCCESS: Found by Standard Regex");
        } else {
            console.log("❌ FAIL: Standard Regex failed.");

            // Fuzzy Search
            const fuzzyRegexStr = "^" + cleanId.split("").map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\s*").join("") + "$";
            const fuzzyRegex = new RegExp(fuzzyRegexStr, "i");
            console.log(`Trying Fuzzy: ${fuzzyRegex}`);
            found = await Entry.findOne({
                vehicleNumber: { $regex: fuzzyRegex },
                exitTime: { $exists: false }
            });

            if (found) {
                console.log("✅ SUCCESS: Found by Fuzzy Regex");
            } else {
                console.log("❌ FAIL: Fuzzy Search also failed.");

                // Debug: Print what IS in the DB
                const actual = await Entry.findById(entry._id);
                console.log("ACTUAL DB RECORD:", actual);
            }
        }

        // Cleanup
        await Entry.deleteOne({ _id: entry._id });
        console.log("Cleanup done.");

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
