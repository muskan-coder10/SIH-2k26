const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    tokenNumber: {
      type: String,
      required: true,
      unique: true,
    },
    cropType: {
      type: String,
      required: true,
    },
    landArea: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    centreName: {
      type: String,
      required: true,
    },
    slotDate: {
      type: Date,
      required: true,
    },
    slotTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "weighed", "procured", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);