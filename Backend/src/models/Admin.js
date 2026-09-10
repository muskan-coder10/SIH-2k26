const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

// Auto-generate adminId like ADM-001, ADM-002...
adminSchema.pre("save", async function () {
  if (this.adminId) return;

  const count = await mongoose.model("Admin").countDocuments();
  const nextNumber = String(count + 1).padStart(3, "0");
  this.adminId = `ADM-${nextNumber}`;
});

module.exports = mongoose.model("Admin", adminSchema);