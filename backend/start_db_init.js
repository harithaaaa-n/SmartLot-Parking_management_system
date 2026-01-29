const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars from root if not found in current dir
// Try loading from parent directory (project root)
dotenv.config({ path: path.join(__dirname, "../.env") });

// Fallback or override from local .env if it exists
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart_parking";

// Import Models
const Slot = require("./models/Slot");
// We import others to ensure indexes are built if defined (Mongoose does this on model init)
require("./models/Entry");
require("./models/Payment");
require("./models/Session");
require("./models/Ticket");

const seedSlots = async () => {
    const slots = [];
    // Create 20 slots: A1-A10, B1-B10
    for (let i = 1; i <= 10; i++) {
        slots.push({ slotNumber: `A${i}`, status: "Available" });
    }
    for (let i = 1; i <= 10; i++) {
        slots.push({ slotNumber: `B${i}`, status: "Available" });
    }

    try {
        const count = await Slot.countDocuments();
        if (count === 0) {
            await Slot.insertMany(slots);
            console.log("✅ Seeded 20 Parking Slots (A1-A10, B1-B10)");
        } else {
            console.log(`ℹ️ Slots already exist (${count} found). Skipping seed.`);
        }
    } catch (error) {
        console.error("Error seeding slots:", error);
    }
};

const initDB = async () => {
    try {
        console.log(`Checking connection to: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected Successfully");

        await seedSlots();

        console.log("✅ Database Initialization Complete");
        process.exit(0);
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
        process.exit(1);
    }
};

initDB();
