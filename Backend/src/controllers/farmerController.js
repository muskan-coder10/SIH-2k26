const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

// @desc   Book a new token/slot
// @route  POST /api/farmer/token
exports.bookToken = async (req, res) => {
  try {
    const { cropType, landArea, centreName, slotDate, slotTime } = req.body;

    if (!cropType || !landArea || !centreName || !slotDate || !slotTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const tokenNumber = "TKN" + Date.now();

    const booking = await Booking.create({
      farmer: req.user.id,
      tokenNumber,
      cropType,
      landArea,
      centreName,
      slotDate,
      slotTime,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in farmer's current/latest token
// @route  GET /api/farmer/token
exports.getMyToken = async (req, res) => {
  try {
    const booking = await Booking.findOne({ farmer: req.user.id }).sort({ createdAt: -1 });
    if (!booking) {
      return res.status(404).json({ message: "No token found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all bookings (schedule) of logged-in farmer
// @route  GET /api/farmer/schedule
exports.getMySchedule = async (req, res) => {
  try {
    const bookings = await Booking.find({ farmer: req.user.id }).sort({ slotDate: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get crop status of a specific booking
// @route  GET /api/farmer/crop-status/:bookingId
exports.getCropStatus = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      farmer: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      tokenNumber: booking.tokenNumber,
      cropType: booking.cropType,
      status: booking.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all payments of logged-in farmer
// @route  GET /api/farmer/payment
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ farmer: req.user.id })
      .populate("booking", "tokenNumber cropType")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};