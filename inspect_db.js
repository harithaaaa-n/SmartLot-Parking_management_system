const mongoose = require("mongoose");
const Entry = require("./backend/models/Entry");
const Slot = require("./backend/models/Slot");

const inspect = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/smart_parking");
        console.log("Connected to MongoDB via local URI");

        const activeEntries = await Entry.find({ exitTime: { $exists: false } }).populate("slotId");
        console.log(`Found ${activeEntries.length} active entries:`);
        activeEntries.forEach(e => {
            console.log(`- Vehicle: '${e.vehicleNumber}', Slot: '${e.slotId ? e.slotId.slotNumber : 'N/A'}', EntryTime: ${e.entryTime}, ID: ${e._id}`);
        });

        const allEntriesCount = await Entry.countDocuments();
        console.log(`Total entries in DB: ${allEntriesCount}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

inspect();
