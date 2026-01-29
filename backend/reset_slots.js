const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart_parking";

// Import Slot Model
// We need to register it with mongoose
const Slot = require("./models/Slot");

const resetSlots = async () => {
    try {
        console.log(`Connecting to: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected");

        const result = await Slot.updateMany({}, { $set: { status: "Available" } });

        console.log(`✅ Reset Complete.`);
        console.log(`- Matched Slots: ${result.matchedCount}`);
        console.log(`- Modified Slots: ${result.modifiedCount}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error resetting slots:", error);
        process.exit(1);
    }
};

resetSlots();
