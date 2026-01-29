const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true },
  vehicleNumber: String,
  slotNumber: String,
  entryTime: Date,
  exitTime: Date,
  durationMinutes: Number,

  amount: Number,
  pricingType: {
    type: String,
    default: "Dynamic"
  },

  // Payment Details
  paymentId: String,
  orderId: String,
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },
  paymentMode: {
    type: String,
    default: "Cash"
  },

  status: {
    type: String,
    enum: ["Active", "Closed"],
    default: "Active"
  },

  // Feedback System
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  feedbackTime: Date
});

module.exports = mongoose.model("Ticket", ticketSchema);
