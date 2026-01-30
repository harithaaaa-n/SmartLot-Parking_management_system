const Slot = require("../models/Slot");
const Ticket = require("../models/Ticket");
const Entry = require("../models/Entry");
const calculateDynamicPrice = require("../utils/billing");
const mongoose = require("mongoose");

console.log("!!! LOADING ENTRY CONTROLLER !!! FROM:", __filename);
console.log("!!! CWD:", process.cwd());

// VEHICLE ENTRY
const vehicleEntry = async (req, res) => {
  try {
    const { vehicleNumber } = req.body;
    const cleanVehicleNumber = vehicleNumber ? vehicleNumber.replace(/\s+/g, "").toUpperCase() : "";

    // VALIDATION: Strict format check (Safety Layer)
    // Matches: TN01AB1234 or TN01A1234
    const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    if (!vehicleRegex.test(cleanVehicleNumber)) {
      return res.status(400).json({
        message: "Invalid vehicle number format. Required: XX00XX0000 (e.g., TN01AB1234)."
      });
    }

    // CHECK: duplicate entry
    // CHECK: duplicate entry in Entry OR Ticket collection
    const existingEntry = await Entry.findOne({
      vehicleNumber: cleanVehicleNumber,
      exitTime: { $exists: false }
    });

    const existingTicket = await Ticket.findOne({
      vehicleNumber: cleanVehicleNumber,
      status: "Active"
    });

    if (existingEntry || existingTicket) {
      return res.status(400).json({
        message: "Vehicle already inside parking"
      });
    }

    // OPTIMIZED: Assign sequential slots (e.g. A1 -> A2 -> A3)
    // using numeric ordering so A2 comes before A10
    const slot = await Slot.findOne({ status: "Available" })
      .collation({ locale: "en", numericOrdering: true })
      .sort({ slotNumber: 1 });
    if (!slot) {
      return res.status(400).json({ message: "No slots available" });
    }

    slot.status = "Occupied";
    await slot.save();

    const entry = await Entry.create({
      vehicleNumber: cleanVehicleNumber,
      slotId: slot._id
    });

    // Generate Ticket ID: DDMMYYYY-XXXX (Sequential)
    // RETRY LOGIC Loop to prevent Duplicate Keys
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const datePrefix = `${dd}${mm}${yyyy}`;

    let ticket;
    let attempts = 0;
    while (attempts < 3) { // Retry up to 3 times
      try {
        // Find the highest sequence for TODAY using string comparison (Index friendly)
        // matches anything starting with the prefix [datePrefix-0000 to datePrefix-9999]
        const lastTicket = await Ticket.findOne({
          ticketNumber: {
            $gte: `${datePrefix}-0000`,
            $lte: `${datePrefix}-9999`
          }
        }).sort({ ticketNumber: -1 });

        let nextSequence = 1;

        if (lastTicket && lastTicket.ticketNumber) {
          const parts = lastTicket.ticketNumber.split('-');
          if (parts.length === 2 && parts[0] === datePrefix) {
            const lastSeq = parseInt(parts[1], 10);
            if (!isNaN(lastSeq)) {
              nextSequence = lastSeq + 1;
            }
          }
        }

        // Add minimal random buffer if retrying to reduce collisions
        if (attempts > 0) {
          console.log(`[Retry] Collision detected. Incrementing sequence... (Attempt ${attempts + 1})`);
          nextSequence += attempts;
        }

        const sequence = String(nextSequence).padStart(4, '0');
        const ticketId = `${datePrefix}-${sequence}`;
        console.log(`[Entry] Generating Ticket: ${ticketId} for ${cleanVehicleNumber} (Last Found: ${lastTicket?.ticketNumber})`);

        // ATTEMPT CREATION
        ticket = await Ticket.create({
          ticketNumber: ticketId,
          vehicleNumber: cleanVehicleNumber,
          slotNumber: slot.slotNumber,
          entryTime: entry.entryTime,
          status: "Active"
        });

        // If successful, break loop
        break;

      } catch (err) {
        if (err.code === 11000) { // catch only duplicate key errors
          console.warn(`[WARN] Duplicate Key Error on retry ${attempts}. Retrying...`);
          attempts++;
          if (attempts >= 3) throw new Error("System busy, failed to generate unique ticket ID. Please try again.");
        } else {
          throw err; // throw other errors immediately
        }
      }
    }

    res.status(201).json({
      message: "Vehicle parked & ticket generated",
      entryId: entry._id,
      ticket
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VEHICLE EXIT (SAFE + BILLING)
const vehicleExit = async (req, res) => {
  try {
    const { id } = req.params;

    let entry;
    if (mongoose.Types.ObjectId.isValid(id)) {
      entry = await Entry.findById(id).populate("slotId");
    } else {
      // 1. Try to find by Ticket Number
      // Matches DDMMYYYY-XXXX or TICKET-Timestamp (legacy)
      const ticket = await Ticket.findOne({
        ticketNumber: { $regex: new RegExp(`^${id.replace(/\s+/g, "").trim()}$`, "i") }
      });

      if (ticket) {
        // Find associated active entry
        const ticketVehicle = ticket.vehicleNumber.replace(/\s+/g, "");
        entry = await Entry.findOne({
          vehicleNumber: { $regex: new RegExp(`^${ticketVehicle}$`, "i") },
          exitTime: { $exists: false }
        }).populate("slotId");
      }

      // 2. If not found via ticket, try as Vehicle Number
      if (!entry) {
        const cleanId = id.replace(/\s+/g, "").trim();
        const searchRegex = new RegExp(`^${cleanId}$`, "i");

        entry = await Entry.findOne({
          vehicleNumber: { $regex: searchRegex },
          exitTime: { $exists: false }
        }).populate("slotId");

        // Fuzzy Fallback
        if (!entry) {
          const fuzzyRegexStr = "^" + cleanId.split("").map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\s*").join("") + "$";
          const fuzzyRegex = new RegExp(fuzzyRegexStr, "i");
          console.log(`[Exit] Fuzzy searching for: ${cleanId}`);
          entry = await Entry.findOne({
            vehicleNumber: { $regex: fuzzyRegex },
            exitTime: { $exists: false }
          }).populate("slotId");
        }
      }
    }

    if (!entry) {
      // Check if it exists but is closed
      const closedEntry = await Entry.findOne({
        $or: [
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
          { vehicleNumber: { $regex: new RegExp(`^${id.replace(/\s+/g, "").trim()}$`, "i") } }
        ],
        exitTime: { $exists: true }
      });

      if (closedEntry) {
        return res.status(400).json({ message: "Vehicle already exited" });
      }

      return res.status(404).json({ message: "No active parking session found for this vehicle" });
    }

    if (entry.exitTime) {
      return res.status(400).json({ message: "Vehicle already exited" });
    }

    entry.exitTime = new Date();
    const durationMinutes = Math.ceil(
      (entry.exitTime - entry.entryTime) / (1000 * 60)
    );
    entry.durationMinutes = durationMinutes;
    let amount = calculateDynamicPrice(durationMinutes);

    const { actualSlotNumber, paymentMode } = req.body;
    if (actualSlotNumber && entry.slotId && entry.slotId.slotNumber !== actualSlotNumber) {
      entry.isWrongParking = true;
      entry.reportedSlotNumber = actualSlotNumber;
      console.log(`[ALERT] Wrong Slot Detected! Assigned: ${entry.slotId.slotNumber}, Used: ${actualSlotNumber}`);

      // IMPOSE PENALTY
      const PENALTY_AMOUNT = 50;
      amount += PENALTY_AMOUNT;
      console.log(`[BILLING] Penalty of ₹${PENALTY_AMOUNT} added. New Total: ₹${amount}`);
    }

    await entry.save();

    await Slot.findByIdAndUpdate(entry.slotId, { status: "Available" });

    // Find ticket case-insensitively too
    const ticket = await Ticket.findOne({
      vehicleNumber: { $regex: new RegExp(`^${entry.vehicleNumber}$`, "i") },
      status: "Active"
    });

    if (ticket) {
      ticket.exitTime = entry.exitTime;
      ticket.durationMinutes = durationMinutes;
      ticket.amount = amount;
      ticket.status = "Closed";

      // Save Dummy Payment Info
      ticket.paymentStatus = "Paid";
      ticket.paymentMode = paymentMode || "Cash"; // Default to Cash if not provided
      ticket.paymentId = `DUMMY-${Date.now()}`; // structured dummy ID

      await ticket.save();
    }

    res.json({
      message: "Vehicle exited & billing completed",
      durationMinutes,
      pricingType: "Dynamic",
      amount,
      ticket
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BILL CALCULATION PREVIEW (Check price before exit)
const calculateExit = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`[DEBUG] calculateExit called with id: '${id}'`);

    let entry;

    if (mongoose.Types.ObjectId.isValid(id)) {
      console.log(`[DEBUG] Treating '${id}' as ObjectId`);
      entry = await Entry.findById(id).populate("slotId");
    } else {
      // 1. Try to find by Ticket Number
      console.log(`[DEBUG] Treating '${id}' as potential Ticket Number or Vehicle Number`);
      const ticket = await Ticket.findOne({
        ticketNumber: { $regex: new RegExp(`^${id.replace(/\s+/g, "").trim()}$`, "i") }
      });

      if (ticket) {
        // Find associated active entry
        const ticketVehicle = ticket.vehicleNumber.replace(/\s+/g, "");
        console.log(`[DEBUG] Found ticket for vehicle ${ticket.vehicleNumber}. Finding Active Entry...`);
        entry = await Entry.findOne({
          vehicleNumber: { $regex: new RegExp(`^${ticketVehicle}$`, "i") },
          exitTime: { $exists: false }
        }).populate("slotId");
      }

      // 2. If not found via ticket, try as Vehicle Number
      if (!entry) {
        const cleanId = id.replace(/\s+/g, "").trim();
        const regex = new RegExp(`^${cleanId}$`, "i");
        console.log(`[DEBUG] Treating '${id}' as Vehicle Number. Sanitized: '${cleanId}'`);

        entry = await Entry.findOne({
          vehicleNumber: { $regex: regex },
          exitTime: { $exists: false }
        }).populate("slotId");

        // Fuzzy Fallback
        if (!entry) {
          const fuzzyRegexStr = "^" + cleanId.split("").map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\s*").join("") + "$";
          const fuzzyRegex = new RegExp(fuzzyRegexStr, "i");
          console.log(`[DEBUG] Strict search failed. Trying Fuzzy: ${fuzzyRegex}`);
          entry = await Entry.findOne({
            vehicleNumber: { $regex: fuzzyRegex },
            exitTime: { $exists: false }
          }).populate("slotId");
        }
      }
    }

    if (!entry) {
      // Check if it exists but is closed
      const closedEntry = await Entry.findOne({
        vehicleNumber: { $regex: new RegExp(`^${id.replace(/\s+/g, "").trim()}$`, "i") },
        exitTime: { $exists: true }
      });

      if (closedEntry) {
        return res.status(400).json({ message: "Vehicle has already exited and the session is closed" });
      }

      return res.status(404).json({ message: "No active parking session found for this vehicle" });
    }

    console.log(`[DEBUG] Found active entry: ${entry._id} for ${entry.vehicleNumber}`);

    const exitTime = new Date();
    const durationMinutes = Math.ceil((exitTime - entry.entryTime) / (1000 * 60));
    const amount = calculateDynamicPrice(durationMinutes);

    // Fetch associated active ticket to ensure we have ticketNumber
    // Fetch associated active ticket to ensure we have ticketNumber
    let ticket = await Ticket.findOne({
      vehicleNumber: { $regex: new RegExp(`^${entry.vehicleNumber}$`, "i") },
      status: { $regex: /^active$/i }
    }).sort({ entryTime: -1 });

    console.log(`[DEBUG] Ticket Query result:`, ticket);

    if (!ticket || !ticket.ticketNumber) {
      if (ticket) console.log("[WARN] Ticket found but has NO ticketNumber. Recreating...");
      console.log(`[WARN] Missing ticket for active entry ${entry.vehicleNumber}. Creating restored ticket.`);
      ticket = new Ticket({
        ticketNumber: `TICKET-RESTORED-${Date.now()}`,
        vehicleNumber: entry.vehicleNumber,
        slotNumber: entry.slotId ? entry.slotId.slotNumber : "Unknown",
        entryTime: entry.entryTime,
        status: "Active",
        pricingType: "Dynamic"
      });
      await ticket.save();
    }

    console.log(`[DEBUG] Final Ticket for ${entry.vehicleNumber}:`, ticket);

    res.json({
      vehicleNumber: entry.vehicleNumber,
      entryTime: entry.entryTime,
      exitTime,
      durationMinutes,
      amount,
      slotNumber: entry.slotId ? entry.slotId.slotNumber : "Unknown",
      ticketNumber: ticket ? ticket.ticketNumber : null
    });

  } catch (error) {
    console.error(`[DEBUG] Error in calculateExit: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// GET ACTIVE SESSIONS (For Admin Dashboard)
const getActiveSessions = async (req, res) => {
  try {
    const activeEntries = await Entry.find({ exitTime: { $exists: false } })
      .populate("slotId", "slotNumber")
      .sort({ entryTime: -1 });

    const sessions = activeEntries.map(entry => ({
      id: entry._id,
      vehicleNumber: entry.vehicleNumber,
      slotNumber: entry.slotId ? entry.slotId.slotNumber : "N/A",
      entryTime: entry.entryTime,
      status: "Active"
    }));

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET DASHBOARD STATS (Today's Analytics & Live Revenue)
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // 1. Vehicles Parked Today
    const todayEntriesCount = await Entry.countDocuments({
      entryTime: { $gte: startOfDay, $lte: endOfDay }
    });

    // 2. Vehicles Exited Today
    const todayExitsCount = await Entry.countDocuments({
      exitTime: { $gte: startOfDay, $lte: endOfDay }
    });

    // 3. Current Active Vehicles
    const activeCount = await Entry.countDocuments({ exitTime: { $exists: false } });

    // 4. Revenue Today (Sum of amounts from closed tickets)
    // We can use Ticket model or infer from Entry if we stored amount there (we didn't store amount in Entry but in Ticket)
    // Let's use Ticket for revenue accuracy.
    const revenueResult = await Ticket.aggregate([
      {
        $match: {
          exitTime: { $gte: startOfDay, $lte: endOfDay },
          status: "Closed"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // 5. Recent Wrong Slot Alerts (Last 5)
    // We explicitly look for entries where isWrongParking is true
    const recentAlerts = await Entry.find({ isWrongParking: true })
      .sort({ exitTime: -1 })
      .limit(5)
      .populate('slotId', 'slotNumber');

    // Format for frontend
    const alerts = recentAlerts.map(a => ({
      id: a._id,
      vehicleNumber: a.vehicleNumber,
      assignedSlot: a.slotId ? a.slotId.slotNumber : "Unknown",
      usedSlot: a.reportedSlotNumber || "Unknown",
      timestamp: a.exitTime
    }));

    res.json({
      todayEntries: todayEntriesCount,
      todayExits: todayExitsCount,
      currentActive: activeCount,
      todayRevenue: totalRevenue,
      recentAlerts: alerts
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET DETAILED ANALYTICS (Charts & deeply computed stats)
const getDetailedAnalytics = async (req, res) => {
  try {
    const now = new Date();
    // Start of day in local time approximation or just use 00:00 UTC? 
    // Ideally we want 00:00 IST. 
    // Let's rely on the machine's local time if server is local, or explicit offsets.
    // For this specific code block, let's keep startOfDay standard but fix the aggregation.
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // 1. Hourly Entries (for Bar Chart) - Adjusted for IST (+5:30)
    const hourlyEntriesRaw = await Entry.aggregate([
      {
        $match: {
          entryTime: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          // Use timezone for accurate local hour
          _id: { $hour: { date: "$entryTime", timezone: "Asia/Kolkata" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format for Recharts
    const hourlyData = hourlyEntriesRaw.map(item => ({
      hour: `${item._id.toString().padStart(2, '0')}:00`,
      vehicles: item.count
    }));

    // 2. Peak Hour
    let peakHour = "N/A";
    if (hourlyEntriesRaw.length > 0) {
      const maxEntry = hourlyEntriesRaw.reduce((prev, current) => (prev.count > current.count) ? prev : current);
      peakHour = `${maxEntry._id.toString().padStart(2, '0')}:00 - ${(maxEntry._id + 1).toString().padStart(2, '0')}:00`;
    }

    // 3. Slot Usage Distribution (TODAY'S TOTAL USAGE)
    // Instead of active only, look at WHAT SECTIONS WERE USED TODAY
    const todaysEntries = await Entry.find({
      entryTime: { $gte: startOfDay, $lte: endOfDay }
    }).populate('slotId');

    const sectionCounts = {};

    todaysEntries.forEach(entry => {
      if (entry.slotId && entry.slotId.slotNumber) {
        const section = entry.slotId.slotNumber.charAt(0).toUpperCase();
        sectionCounts[section] = (sectionCounts[section] || 0) + 1;
      }
    });

    const slotDistribution = Object.keys(sectionCounts).map(section => ({
      name: `Section ${section}`,
      value: sectionCounts[section],
      color: section === 'A' ? '#3b82f6' : section === 'B' ? '#10b981' : section === 'C' ? '#f59e0b' : '#ef4444'
    }));

    // If empty today, show placeholder to avoid "Available 100%" confusion
    if (slotDistribution.length === 0) {
      // Optional: could push a dummy "No Data" or just return empty
    }

    // 4. Utilization Rate (Current Active / Total) - Keep this as "Current"
    const totalSlots = await Slot.countDocuments();
    const currentActiveCount = await Entry.countDocuments({ exitTime: { $exists: false } });
    const utilizationRate = totalSlots > 0 ? Math.round((currentActiveCount / totalSlots) * 100) : 0;

    res.json({
      hourlyData,
      peakHour,
      slotDistribution,
      utilizationRate
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PARKING HISTORY (All past and present sessions)
const getParkingHistory = async (req, res) => {
  try {
    const entries = await Entry.find()
      .populate("slotId", "slotNumber")
      .sort({ entryTime: -1 });

    const history = entries.map(entry => {
      // Calculate duration/amount if not stored directly (though exit updates it)
      let status = "Active";
      let duration = "Active";
      let amount = "Active";

      if (entry.exitTime) {
        status = "Completed";
        duration = `${entry.durationMinutes || 0} mins`;
        // Amount is ideally in Ticket, but for history view we might need to fetch Ticket or approximate.
        // For simplicity in this view, let's calculate dynamic price again if needed or use stored if we add it to Entry model later.
        // But importantly, we have duration.
        amount = `₹${calculateDynamicPrice(entry.durationMinutes || 0)}`;
      }

      return {
        id: entry._id,
        vehicleNumber: entry.vehicleNumber,
        slotNumber: entry.slotId ? entry.slotId.slotNumber : "Deleted",
        entryTime: entry.entryTime,
        exitTime: entry.exitTime,
        duration: duration,
        status: status,
        amount: amount
      };
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER HISTORY (Public - All Tickets)
const getUserHistory = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ entryTime: -1 }); // Newest first

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUBMIT FEEDBACK
const submitFeedback = async (req, res) => {
  try {
    const { ticketNumber, rating, feedback } = req.body;

    if (!ticketNumber || !rating) {
      return res.status(400).json({ message: "Ticket Number and Rating are required" });
    }

    const ticket = await Ticket.findOne({ ticketNumber });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.rating = rating;
    ticket.feedback = feedback;
    ticket.feedbackTime = new Date();
    await ticket.save();

    res.json({ message: "Feedback submitted successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { vehicleEntry, vehicleExit, calculateExit, getActiveSessions, getDashboardStats, getDetailedAnalytics, getParkingHistory, getUserHistory, submitFeedback };
