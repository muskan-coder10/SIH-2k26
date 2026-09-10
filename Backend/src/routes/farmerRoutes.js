const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  bookToken,
  getMyToken,
  getMySchedule,
  getCropStatus,
  getMyPayments,
} = require("../controllers/farmerController");
const {
  submitComplaint,
  getMyComplaints,
} = require("../controllers/complaintController");

// All routes below require login + farmer role
router.use(protect, authorizeRoles("farmer"));

router.post("/token", bookToken);
router.get("/token", getMyToken);
router.get("/schedule", getMySchedule);
router.get("/crop-status/:bookingId", getCropStatus);
router.get("/payment", getMyPayments);

router.post("/complaints", submitComplaint);
router.get("/complaints", getMyComplaints);

module.exports = router;