const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getPendingBookings,
  verifyBooking,
  updateProcurement,
  getAllBookings,
  createOrUpdatePayment,
  getDashboardSummary,
  getAllFarmersForOfficer,
  getCentreReports,
  changePassword,
} = require("../controllers/officerController");

// All routes below require login + officer role
router.use(protect, authorizeRoles("officer"));

// Dashboard
router.get("/dashboard-summary", getDashboardSummary);

// Farmers (read-only directory)
router.get("/farmers", getAllFarmersForOfficer);

// Verification
router.get("/verification", getPendingBookings);
router.put("/verification/:bookingId", verifyBooking);

// Procurement / Weighing
router.get("/procurement", getAllBookings);
router.put("/procurement/:bookingId", updateProcurement);

// Payment update
router.post("/payment", createOrUpdatePayment);

// Reports
router.get("/reports", getCentreReports);

// Settings
router.put("/change-password", changePassword);

module.exports = router;