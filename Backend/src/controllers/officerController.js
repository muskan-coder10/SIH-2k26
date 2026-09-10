const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Farmer = require("../models/Farmer");
const Centre = require("../models/Centre");
const Officer = require("../models/Officer");
const bcrypt = require("bcryptjs");

// @desc   Get all pending bookings (for verification)
// @route  GET /api/officer/verification
exports.getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "pending" })
      .populate("farmer", "name phone village district")
      .sort({ slotDate: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Verify a farmer's booking
// @route  PUT /api/officer/verification/:bookingId
exports.verifyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "verified";
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update procurement/weighing status of a booking
// @route  PUT /api/officer/procurement/:bookingId
exports.updateProcurement = async (req, res) => {
  try {
    const { status, quantity } = req.body;

    const allowedStatuses = ["weighed", "procured", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    if (quantity) booking.quantity = quantity;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all bookings under officer's centre
// @route  GET /api/officer/procurement
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("farmer", "name phone village district")
      .sort({ slotDate: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create or update payment for a booking
// @route  POST /api/officer/payment
exports.createOrUpdatePayment = async (req, res) => {
  try {
    const { bookingId, amount, status } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ message: "bookingId and amount are required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    let payment = await Payment.findOne({ booking: bookingId });

    if (payment) {
      payment.amount = amount;
      payment.status = status || payment.status;
      if (status === "paid") payment.paidOn = new Date();
      await payment.save();
    } else {
      payment = await Payment.create({
        farmer: booking.farmer,
        booking: bookingId,
        amount,
        status: status || "pending",
        paidOn: status === "paid" ? new Date() : undefined,
      });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ------------------ NEW DASHBOARD (Officer Portal redesign) ------------------

// @desc   Get officer dashboard stats, capacity, next-in-queue and today's schedule
// @route  GET /api/officer/dashboard-summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const centreName = req.user?.centreName;
    const centreFilter = centreName ? { centreName } : {};

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const todayRange = { slotDate: { $gte: startOfDay, $lte: endOfDay } };

    const [totalFarmers, todaysTokens, farmersWaiting] = await Promise.all([
      Farmer.countDocuments(),
      Booking.countDocuments({ ...centreFilter, ...todayRange }),
      Booking.countDocuments({ ...centreFilter, ...todayRange, status: "pending" }),
    ]);

    const centre = centreName ? await Centre.findOne({ name: centreName }) : null;
    const dailyCapacity = centre?.capacityPerDay || 0;

    const bookedAgg = await Booking.aggregate([
      { $match: { ...centreFilter, ...todayRange, status: { $ne: "rejected" } } },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);
    const bookedCapacity = bookedAgg[0]?.total || 0;

    // Today's bookings, used for both "Next in Queue" and "Today's Schedule"
    // on the frontend — no separate live waiting-room state exists yet, so
    // this is a best-effort view built from the existing booking status.
    const todaysBookings = await Booking.find({ ...centreFilter, ...todayRange })
      .populate("farmer", "name village")
      .sort({ slotTime: 1 });

    res.json({
      stats: { totalFarmers, todaysTokens, farmersWaiting },
      capacity: {
        total: dailyCapacity,
        booked: bookedCapacity,
        remaining: dailyCapacity - bookedCapacity,
      },
      todaysBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Read-only list of all farmers (for the officer "Farmers" page)
// @route  GET /api/officer/farmers
exports.getAllFarmersForOfficer = async (req, res) => {
  try {
    const farmers = await Farmer.find().select("-password").sort({ createdAt: -1 });
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Officer's own centre report (falls back to all bookings if no centre set)
// @route  GET /api/officer/reports
exports.getCentreReports = async (req, res) => {
  try {
    const centreName = req.user?.centreName;
    const centreFilter = centreName ? { centreName } : {};

    const totalBookings = await Booking.countDocuments(centreFilter);
    const bookingsByStatus = await Booking.aggregate([
      { $match: centreFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const bookingIds = await Booking.find(centreFilter).distinct("_id");
    const totalPaidAgg = await Payment.aggregate([
      { $match: { booking: { $in: bookingIds }, status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      centreName: centreName || "All centres",
      totalBookings,
      bookingsByStatus,
      totalPaidAmount: totalPaidAgg[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Change own password
// @route  PUT /api/officer/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const officer = await Officer.findById(req.user.id);
    if (!officer) {
      return res.status(404).json({ message: "Officer not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, officer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    officer.password = await bcrypt.hash(newPassword, salt);
    await officer.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};