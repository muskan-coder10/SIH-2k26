const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllFarmers,
  getFarmerById,
  deleteFarmer,
  verifyFarmer,
  rejectFarmer,
  getAllCentres,
  createCentre,
  updateCentre,
  deleteCentre,
  getReports,
  getDashboardSummary,
  getEligibleFarmers,
  getAllBookingsAdmin,
  updateBookingAdmin,
  cancelBookingAdmin,
  getAllPaymentsAdmin,
  updatePaymentAdmin,
  changePassword,
} = require("../controllers/adminController");
const {
  getAllComplaints,
  replyComplaint,
} = require("../controllers/complaintController");

// All routes below require login + admin role
router.use(protect, authorizeRoles("admin"));

// Dashboard
router.get("/dashboard-summary", getDashboardSummary);

// Farmers
router.get("/farmers", getAllFarmers);
router.get("/farmers/:id", getFarmerById);
router.delete("/farmers/:id", deleteFarmer);
router.put("/farmers/:id/verify", verifyFarmer);
router.put("/farmers/:id/reject", rejectFarmer);

// Eligible Farmers
router.get("/eligible-farmers", getEligibleFarmers);

// Centres
router.get("/centres", getAllCentres);
router.post("/centres", createCentre);
router.put("/centres/:id", updateCentre);
router.delete("/centres/:id", deleteCentre);

// Token Management / Procurement (bookings)
router.get("/bookings", getAllBookingsAdmin);
router.put("/bookings/:id", updateBookingAdmin);
router.put("/bookings/:id/cancel", cancelBookingAdmin);

// Payments
router.get("/payments", getAllPaymentsAdmin);
router.put("/payments/:id", updatePaymentAdmin);

// Reports
router.get("/reports", getReports);

// Complaints
router.get("/complaints", getAllComplaints);
router.put("/complaints/:id", replyComplaint);

// Settings
router.put("/change-password", changePassword);

module.exports = router;