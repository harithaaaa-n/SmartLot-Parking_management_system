const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
  },
  slotNumber: {
    type: String,
    required: true,
  },
  entryTime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
});

module.exports = mongoose.model("Session", sessionSchema);
