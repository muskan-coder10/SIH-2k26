const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farmer",
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "resolved"],
            default: "pending",
        },
        adminReply: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);