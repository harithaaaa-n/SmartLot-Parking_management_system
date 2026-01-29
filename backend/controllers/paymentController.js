const Razorpay = require("razorpay");
const crypto = require("crypto");
const Ticket = require("../models/Ticket");
const Entry = require("../models/Entry");
const Slot = require("../models/Slot");
require("dotenv").config();

// Initialize Razorpay (Use env vars or fallback to test keys if local)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_YourKeyHere",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YourSecretHere"
});

// Helper: Calculate Price (Duplicated from entryController for independence)
const calculateDynamicPrice = (minutes) => {
  const baseRate = 20; // First hour
  const hourlyRate = 10; // Per extra hour
  if (minutes <= 60) return baseRate;
  const extraHours = Math.ceil((minutes - 60) / 60);
  return baseRate + (extraHours * hourlyRate);
};

// 1. Create Order (MOCKED FOR DEVELOPMENT)
const createOrder = async (req, res) => {
  try {
    const { ticketId, amount } = req.body; // Amount in INR

    if (!ticketId || !amount) {
      return res.status(400).json({ error: "Ticket ID and Amount required" });
    }

    // MOCK RESPONSE - No Real Razorpay Call
    console.log(`[PAYMENT MOCK] Creating mock order for Ticket: ${ticketId}, Amount: ${amount}`);

    // Create a fake order ID
    const mockOrderId = `order_mock_${Date.now()}`;

    // Update Ticket with Order ID (simulate persistence)
    await Ticket.updateOne(
      { ticketNumber: ticketId },
      { orderId: mockOrderId, paymentStatus: 'Pending' }
    );

    res.json({
      id: mockOrderId,
      currency: "INR",
      amount: amount * 100, // paise
      receipt: `receipt_${ticketId}`,
      status: "created"
    });

  } catch (error) {
    console.error("Payment Order Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Verify Payment & Close Ticket
// 2. Verify Payment & Close Ticket
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, ticketId, actualSlotNumber } = req.body;

    // MOCK VERIFICATION BYPASS
    if (razorpay_order_id && razorpay_order_id.toString().startsWith("order_mock_")) {
      console.log(`[PAYMENT MOCK] Verifying mock payment for ${ticketId}`);
      // Skip signature check
    } else {
      // REAL VERIFICATION
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "YourSecretHere")
        .update(body.toString())
        .digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;
      if (!isAuthentic) {
        return res.status(400).json({ success: false, message: "Payment Verification Failed" });
      }
    }

    // Payment Success: Now Close the Ticket and Slot
    // Find valid ticket
    const ticket = await Ticket.findOne({ ticketNumber: ticketId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found for closure" });
    }

    // Find and Update Entry (if exists, legacy check)
    // We search by vehicle number as fallback or link
    const now = new Date();

    // Update Ticket
    ticket.paymentId = razorpay_payment_id;
    ticket.paymentStatus = "Paid";
    ticket.exitTime = now;
    ticket.status = "Closed";
    // Duration/Amount should already be correct from preview, but we can recalc if needed. 
    // Assuming amount paid is correct.
    await ticket.save();

    // Free the Slot
    // If we have slotNumber in Ticket
    if (ticket.slotNumber) {
      // Find existing slot logic (Slot Number string to ID?)
      const slot = await Slot.findOne({ slotNumber: ticket.slotNumber });
      if (slot) {
        slot.isOccupied = false;
        slot.vehicleNumber = null;
        await slot.save();
      }
    }

    // Also update Entry collection if used for analytics/history separate from Ticket
    // Try to find matching active entry
    const entry = await Entry.findOne({
      vehicleNumber: ticket.vehicleNumber,
      exitTime: { $exists: false }
    });

    if (entry) {
      entry.exitTime = now;
      entry.amount = ticket.amount; // Use ticket amount
      entry.durationMinutes = ticket.durationMinutes;
      await entry.save();

      // Also free slot via Entry reference if different
      if (entry.slotId) {
        await Slot.findByIdAndUpdate(entry.slotId, { isOccupied: false, vehicleNumber: null });
      }
    }

    res.json({
      success: true,
      message: "Payment Successful & Gate Opened",
      ticketId: ticket.ticketNumber,
      paymentId: razorpay_payment_id
    });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
