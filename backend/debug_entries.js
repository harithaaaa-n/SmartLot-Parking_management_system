const mongoose = require("mongoose");
const Entry = require("./models/Entry");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const allActive = await Entry.find({ exitTime: { $exists: false } });
        console.log("----- ACTIVE ENTRIES -----");
        allActive.forEach(e => {
            console.log(`ID: ${e._id}, Vehicle: '${e.vehicleNumber}', EntryTime: ${e.entryTime}`);
        });
        console.log("--------------------------");

        const tn = await Entry.find({ vehicleNumber: /TN09AB9999/i });
        console.log("----- SEARCH FOR TN09AB9999 -----");
        tn.forEach(e => {
            console.log(`ID: ${e._id}, Vehicle: '${e.vehicleNumber}', ExitTime: ${e.exitTime}`);
        });
        console.log("---------------------------------");

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
