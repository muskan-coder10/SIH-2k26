const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema(
  {
    farmerId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    village: {
      type: String,
    },
    district: {
      type: String,
    },
    aadhaarNumber: {
      type: String,
    },
    role: {
      type: String,
      default: "farmer",
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto-generate a human-readable farmerId like FR-10001 before saving
farmerSchema.pre("save", async function () {
  if (!this.farmerId) {
    const count = await mongoose.model("Farmer").countDocuments();
    this.farmerId = `FR-${10001 + count}`;
  }
});

module.exports = mongoose.model("Farmer", farmerSchema);