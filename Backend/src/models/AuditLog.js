const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true, // e.g. "Farmer Verified", "Farmer Rejected", "Centre Created"
        },
        actor: {
            id: { type: mongoose.Schema.Types.ObjectId },
            role: { type: String, enum: ["Admin", "Officer"] },
            name: { type: String },
        },
        targetType: {
            type: String, // e.g. "Farmer", "Centre", "Booking"
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        details: {
            type: String, // e.g. "Farmer: FR-UP-10002 · Result: Approved"
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);