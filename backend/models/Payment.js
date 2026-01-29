const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ["Cash", "UPI", "Card"],
    default: "UPI"
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Failed"],
    default: "Paid"
  },
  paymentTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
