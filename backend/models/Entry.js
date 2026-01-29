const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot"
  },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  durationMinutes: { type: Number },
  isWrongParking: { type: Boolean, default: false },
  reportedSlotNumber: { type: String }
});

module.exports = mongoose.model("Entry", entrySchema);
