const express = require("express");
const router = express.Router();
const {
  registerFarmer,
  loginFarmer,
  registerAdmin,
  loginAdmin,
  registerOfficer,
  loginOfficer,
} = require("../controllers/authController");

// Farmer
router.post("/farmer/register", registerFarmer);
router.post("/farmer/login", loginFarmer);

// Admin
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

// Officer
router.post("/officer/register", registerOfficer);
router.post("/officer/login", loginOfficer);

module.exports = router;