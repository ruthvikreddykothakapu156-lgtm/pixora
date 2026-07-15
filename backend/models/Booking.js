const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    photographer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photographer",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
    },
    clientPhone: {
      type: String,
      default: "",
    },
    eventType: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    budgetRange: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentScreenshot: {
      type: String,
      default: "",
    },
    paymentStatus: {
      type: String,
      enum: ["not_submitted", "pending_verification", "verified", "rejected"],
      default: "not_submitted",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);