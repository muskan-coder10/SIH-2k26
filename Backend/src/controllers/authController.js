const Farmer = require("../models/Farmer");
const Admin = require("../models/Admin");
const Officer = require("../models/Officer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ------------------ FARMER ------------------

// @desc   Register a new farmer
// @route  POST /api/auth/farmer/register
exports.registerFarmer = async (req, res) => {
  try {
    const { name, phone, email, password, village, district, aadhaarNumber } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone and password are required" });
    }

    const existingFarmer = await Farmer.findOne({ phone });
    if (existingFarmer) {
      return res.status(400).json({ message: "Farmer already registered with this phone number" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const farmer = await Farmer.create({
      name,
      phone,
      email,
      password: hashedPassword,
      village,
      district,
      aadhaarNumber,
    });

    res.status(201).json({
      _id: farmer._id,
      name: farmer.name,
      phone: farmer.phone,
      email: farmer.email,
      village: farmer.village,
      district: farmer.district,
      role: farmer.role,
      token: generateToken(farmer._id, farmer.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login farmer
// @route  POST /api/auth/farmer/login
exports.loginFarmer = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    const farmer = await Farmer.findOne({ phone });
    if (!farmer) {
      return res.status(400).json({ message: "Invalid phone number or password" });
    }

    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid phone number or password" });
    }

    res.json({
      _id: farmer._id,
      name: farmer.name,
      phone: farmer.phone,
      email: farmer.email,
      village: farmer.village,
      district: farmer.district,
      role: farmer.role,
      token: generateToken(farmer._id, farmer.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ ADMIN ------------------

// @desc   Register a new admin
// @route  POST /api/auth/admin/register
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already registered with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: admin._id,
      adminId: admin.adminId,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login admin
// @route  POST /api/auth/admin/login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: admin._id,
      adminId: admin.adminId,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ OFFICER ------------------

// @desc   Register a new officer
// @route  POST /api/auth/officer/register
exports.registerOfficer = async (req, res) => {
  try {
    const { name, email, password, centreName, centreLocation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingOfficer = await Officer.findOne({ email });
    if (existingOfficer) {
      return res.status(400).json({ message: "Officer already registered with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const officer = await Officer.create({
      name,
      email,
      password: hashedPassword,
      centreName,
      centreLocation,
    });

    res.status(201).json({
      _id: officer._id,
      name: officer.name,
      email: officer.email,
      role: officer.role,
      token: generateToken(officer._id, officer.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login officer
// @route  POST /api/auth/officer/login
exports.loginOfficer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const officer = await Officer.findOne({ email });
    if (!officer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: officer._id,
      name: officer.name,
      email: officer.email,
      role: officer.role,
      token: generateToken(officer._id, officer.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};