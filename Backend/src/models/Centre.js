const mongoose = require("mongoose");

const centreSchema = new mongoose.Schema(
  {
    centreId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    district: {
      type: String,
    },
    capacityPerDay: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate centreId like TAR-WHT-004 (district code + name code + sequence)
centreSchema.pre("save", async function () {
  if (this.centreId) return;

  const districtCode = (this.district || "GEN")
    .replace(/\s+/g, "")
    .slice(0, 3)
    .toUpperCase();
  const nameCode = (this.name || "CTR")
    .replace(/\s+/g, "")
    .slice(0, 3)
    .toUpperCase();

  const count = await mongoose.model("Centre").countDocuments();
  const nextNumber = String(count + 1).padStart(3, "0");

  this.centreId = `${districtCode}-${nameCode}-${nextNumber}`;
});

module.exports = mongoose.model("Centre", centreSchema);