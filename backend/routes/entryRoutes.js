const express = require("express");
const router = express.Router();
const { vehicleEntry, vehicleExit, calculateExit, getActiveSessions, getDashboardStats, getDetailedAnalytics, getParkingHistory, getUserHistory } = require("../controllers/entryController");
console.log("DEBUG: calculateExit source start:", calculateExit.toString().substring(0, 500));

// Analytics & History
router.get("/analytics", getDetailedAnalytics);
router.get("/history", getParkingHistory); // Admin History
router.get("/user-history", getUserHistory); // Public History

// Core Entry/Exit Logic
router.post("/enter", vehicleEntry);
router.put("/exit/:id", vehicleExit);
router.post("/feedback", require("../controllers/entryController").submitFeedback);
router.get("/calculate/:id", calculateExit);
router.get("/active", getActiveSessions);
router.get("/stats", getDashboardStats);

module.exports = router;
