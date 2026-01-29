// server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Import DB connection
const connectDB = require("./config/db");

// Initialize app
const app = express();

// =====================
// Middleware
// =====================
app.use(express.json());

// CORS configuration (IMPORTANT for frontend integration)
// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost (development)
      if (origin.includes("localhost")) return callback(null, true);

      // Allow Vercel deployments (production)
      if (origin.endsWith(".vercel.app")) return callback(null, true);

      // Optional: Add specific custom domains if needed
      // if (origin === "https://mydomain.com") return callback(null, true);

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// =====================
// Connect to MongoDB
// =====================
connectDB();

// =====================
// Routes
// =====================
app.use("/api/slot", require("./routes/slotRoutes"));
app.use("/api/entry", require("./routes/entryRoutes"));
app.use("/api/ticket", require("./routes/ticketRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

// =====================
// Default Test Route
// =====================
app.get("/", (req, res) => {
  res.status(200).send("Smart Parking Management System API is running");
});

// =====================
// Handle Unknown Routes
// =====================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// =====================
// Server Start
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
