const Complaint = require("../models/Complaint");
const AuditLog = require("../models/AuditLog");
const Admin = require("../models/Admin");

// ------------------ HELPER: Resolve actor info for AuditLog ------------------
async function getActorInfo(req) {
  const userId = req.user?.id || req.user?._id;
  let name = req.user?.name;

  if (!name && userId) {
    try {
      const admin = await Admin.findById(userId).select("name fullName username email");
      name = admin?.name || admin?.fullName || admin?.username || admin?.email || null;
    } catch (e) {
      name = null;
    }
  }

  return {
    id: userId,
    role: "Admin",
    name: name || "Unknown Admin",
  };
}

// ------------------ FARMER SIDE ------------------

// @desc   Submit a new complaint
// @route  POST /api/farmer/complaints
exports.submitComplaint = async (req, res) => {
  try {
    const { subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ message: "Subject and description are required" });
    }

    const complaint = await Complaint.create({
      farmer: req.user.id,
      subject,
      description,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in farmer's own complaints
// @route  GET /api/farmer/complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ ADMIN SIDE ------------------

// @desc   Get all complaints (all farmers)
// @route  GET /api/admin/complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("farmer", "name farmerId village phone")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Reply to a complaint and mark it resolved
// @route  PUT /api/admin/complaints/:id
exports.replyComplaint = async (req, res) => {
  try {
    const { adminReply } = req.body;

    if (!adminReply) {
      return res.status(400).json({ message: "adminReply is required" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.adminReply = adminReply;
    complaint.status = "resolved";
    await complaint.save();

    const actor = await getActorInfo(req);
    await AuditLog.create({
      action: "Complaint Resolved",
      actor,
      targetType: "Complaint",
      targetId: complaint._id,
      details: `Subject: ${complaint.subject}`,
    });

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};