const Farmer = require("../models/Farmer");
const Centre = require("../models/Centre");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const AuditLog = require("../models/AuditLog");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

// ------------------ FARMERS ------------------

// @desc   Get all farmers
// @route  GET /api/admin/farmers
exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().select("-password");
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single farmer by id
// @route  GET /api/admin/farmers/:id
exports.getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id).select("-password");
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete a farmer
// @route  DELETE /api/admin/farmers/:id
exports.deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.json({ message: "Farmer removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Verify a farmer's application
// @route  PUT /api/admin/farmers/:id/verify
exports.verifyFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    farmer.verificationStatus = "verified";
    farmer.rejectionReason = "";
    await farmer.save();

    await AuditLog.create({
      action: "Farmer Verified",
      actor: {
        id: req.user?._id,
        role: "Admin",
        name: req.user?.name,
      },
      targetType: "Farmer",
      targetId: farmer._id,
      details: `Farmer: ${farmer.farmerId} · Result: Approved`,
    });

    res.json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Reject a farmer's application
// @route  PUT /api/admin/farmers/:id/reject
exports.rejectFarmer = async (req, res) => {
  try {
    const { reason } = req.body;

    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    farmer.verificationStatus = "rejected";
    farmer.rejectionReason = reason || "Not specified";
    await farmer.save();

    await AuditLog.create({
      action: "Farmer Rejected",
      actor: {
        id: req.user?._id,
        role: "Admin",
        name: req.user?.name,
      },
      targetType: "Farmer",
      targetId: farmer._id,
      details: `Farmer: ${farmer.farmerId} · Reason: ${farmer.rejectionReason}`,
    });

    res.json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ CENTRES ------------------

// @desc   Get all centres
// @route  GET /api/admin/centres
exports.getAllCentres = async (req, res) => {
  try {
    const centres = await Centre.find();
    res.json(centres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create a new centre
// @route  POST /api/admin/centres
exports.createCentre = async (req, res) => {
  try {
    const { name, location, district, capacityPerDay } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    const centre = await Centre.create({ name, location, district, capacityPerDay });

    await AuditLog.create({
      action: "Centre Created",
      actor: {
        id: req.user?._id,
        role: "Admin",
        name: req.user?.name,
      },
      targetType: "Centre",
      targetId: centre._id,
      details: `Centre: ${centre.centreId} · Location: ${centre.location}`,
    });

    res.status(201).json(centre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update a centre
// @route  PUT /api/admin/centres/:id
exports.updateCentre = async (req, res) => {
  try {
    const centre = await Centre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!centre) {
      return res.status(404).json({ message: "Centre not found" });
    }

    res.json(centre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete a centre
// @route  DELETE /api/admin/centres/:id
exports.deleteCentre = async (req, res) => {
  try {
    const centre = await Centre.findByIdAndDelete(req.params.id);
    if (!centre) {
      return res.status(404).json({ message: "Centre not found" });
    }
    res.json({ message: "Centre removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ REPORTS ------------------

// @desc   Get overall system stats
// @route  GET /api/admin/reports
exports.getReports = async (req, res) => {
  try {
    const totalFarmers = await Farmer.countDocuments();
    const totalCentres = await Centre.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalPaidAmount = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      totalFarmers,
      totalCentres,
      totalBookings,
      totalPaidAmount: totalPaidAmount[0]?.total || 0,
      bookingsByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ DASHBOARD SUMMARY (Image-1 style) ------------------

// @desc   Get all dashboard stats, capacity, awaiting-action list, audit feed in one call
// @route  GET /api/admin/dashboard-summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const [
      registeredFarmers,
      pendingVerification,
      verifiedFarmers,
      rejectedApplications,
      activeCentres,
    ] = await Promise.all([
      Farmer.countDocuments(),
      Farmer.countDocuments({ verificationStatus: "pending" }),
      Farmer.countDocuments({ verificationStatus: "verified" }),
      Farmer.countDocuments({ verificationStatus: "rejected" }),
      Centre.countDocuments({ isActive: true }),
    ]);

    // Today's total capacity = sum of capacityPerDay across active centres
    const centres = await Centre.find({ isActive: true }).select("capacityPerDay");
    const todaysCapacity = centres.reduce(
      (sum, c) => sum + (c.capacityPerDay || 0),
      0
    );

    // Today's booked capacity = live aggregate from Booking (no stored field)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAgg = await Booking.aggregate([
      {
        $match: {
          slotDate: { $gte: startOfDay, $lte: endOfDay },
          status: { $ne: "rejected" },
        },
      },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);
    const todaysBookedCapacity = bookedAgg[0]?.total || 0;

    // Farmers awaiting action — latest bookings with farmer info
    const awaitingActionRaw = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("farmer", "name farmerId village verificationStatus");

    const awaitingAction = awaitingActionRaw
      .filter((b) => b.farmer)
      .map((b) => ({
        farmerName: b.farmer.name,
        farmerId: b.farmer.farmerId,
        village: b.farmer.village,
        crop: b.cropType,
        status: b.farmer.verificationStatus,
      }));

    // Recent audit activity
    const recentAuditActivity = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        registeredFarmers,
        pendingVerification,
        verifiedFarmers,
        rejectedApplications,
        activeCentres,
        todaysCapacity,
        todaysBookedCapacity,
      },
      capacity: {
        total: todaysCapacity,
        booked: todaysBookedCapacity,
        remaining: todaysCapacity - todaysBookedCapacity,
      },
      awaitingAction,
      recentAuditActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ------------------ ELIGIBLE FARMERS ------------------

// @desc   Verified farmers, flagged with whether they have an active/upcoming booking
// @route  GET /api/admin/eligible-farmers
exports.getEligibleFarmers = async (req, res) => {
  try {
    const verifiedFarmers = await Farmer.find({ verificationStatus: "verified" }).select("-password");

    // "Active/upcoming" = anywhere in the procurement pipeline before final states
    const activeFarmerIds = await Booking.find({
      status: { $in: ["pending", "verified", "weighed"] },
    }).distinct("farmer");
    const activeSet = new Set(activeFarmerIds.map((id) => id.toString()));

    const result = verifiedFarmers.map((f) => ({
      ...f.toObject(),
      hasActiveBooking: activeSet.has(f._id.toString()),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ TOKEN MANAGEMENT / PROCUREMENT (ADMIN) ------------------

// @desc   Get all bookings, optionally filtered by centre/status/date
// @route  GET /api/admin/bookings?centreName=&status=&date=
exports.getAllBookingsAdmin = async (req, res) => {
  try {
    const { centreName, status, date } = req.query;
    const filter = {};
    if (centreName) filter.centreName = centreName;
    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.slotDate = { $gte: start, $lte: end };
    }

    const bookings = await Booking.find(filter)
      .populate("farmer", "name phone village district farmerId")
      .sort({ slotDate: -1, slotTime: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Edit a booking's details
// @route  PUT /api/admin/bookings/:id
exports.updateBookingAdmin = async (req, res) => {
  try {
    const allowedFields = ["cropType", "quantity", "centreName", "slotDate", "slotTime", "status"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("farmer", "name phone village district farmerId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Cancel a booking (marks it rejected)
// @route  PUT /api/admin/bookings/:id/cancel
exports.cancelBookingAdmin = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).populate("farmer", "name phone village district farmerId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ PAYMENTS (ADMIN) ------------------

// @desc   Get all payments, optionally filtered by status/centre
// @route  GET /api/admin/payments?status=&centreName=
exports.getAllPaymentsAdmin = async (req, res) => {
  try {
    const { status, centreName } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let payments = await Payment.find(filter)
      .populate("farmer", "name phone village farmerId")
      .populate("booking", "tokenNumber centreName cropType quantity")
      .sort({ createdAt: -1 });

    if (centreName) {
      payments = payments.filter((p) => p.booking?.centreName === centreName);
    }

    const totalPaid = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({ payments, totalPaid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Manually update a payment's status/amount
// @route  PUT /api/admin/payments/:id
exports.updatePaymentAdmin = async (req, res) => {
  try {
    const { status, amount } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (status) payment.status = status;
    if (amount !== undefined) payment.amount = amount;
    if (status === "paid") payment.paidOn = new Date();
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ SETTINGS ------------------

// @desc   Change own password
// @route  PUT /api/admin/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};