try {
  const pc = require("./backend/controllers/paymentController");
  console.log("Exports:", pc);
} catch (e) {
  console.error("Error loading mod:", e);
}
