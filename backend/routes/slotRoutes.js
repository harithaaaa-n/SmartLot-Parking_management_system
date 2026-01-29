const express = require("express");
const router = express.Router();
const { createSlot, getAllSlots, updateSlotStatus, deleteSlot } = require("../controllers/slotController");

router.post("/create", createSlot);
router.get("/all", getAllSlots);
router.put("/update/:id", updateSlotStatus);
router.delete("/delete/:id", deleteSlot);

module.exports = router;
