const Slot = require("../models/Slot");

const createSlot = async (req, res) => {
  try {
    const exists = await Slot.findOne({ slotNumber: req.body.slotNumber });
    if (exists) {
      return res.status(400).json({ message: "Slot already exists" });
    }

    const slot = await Slot.create(req.body);
    res.status(201).json({
      message: "Slot created successfully",
      slot
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllSlots = async (req, res) => {
  const slots = await Slot.find();
  res.json(slots);
};



const updateSlotStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Available', 'Occupied', 'Maintenance'

    // Check current status first
    const slot = await Slot.findOne({ slotNumber: req.params.id });

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // POLICY: Cannot manually change status if currently Occupied
    if (slot.status === 'Occupied' || slot.status === 'occupied') {
      return res.status(400).json({
        message: `Cannot change status of slot ${slot.slotNumber} because it is currently Occupied.`
      });
    }

    slot.status = status;
    await slot.save();

    res.json({ message: "Slot status updated", slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findOneAndDelete({ slotNumber: req.params.id });
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createSlot, getAllSlots, updateSlotStatus, deleteSlot };
