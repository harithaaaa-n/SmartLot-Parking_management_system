const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ["Available", "Occupied"],
    default: "Available"
  }
});

module.exports = mongoose.model("Slot", slotSchema);
