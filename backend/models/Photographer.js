const mongoose = require("mongoose");

const photographerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
    specializations: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
      default: "",
    },
    priceRange: {
      type: String,
      default: "",
    },
    pricing: [
      {
        eventType: { type: String },
        price: { type: Number },
      },
    ],
    coverPhoto: {
      type: String,
      default: "",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    qrCodeImage: {
      type: String,
      default: "",
    },
    socialLinks: {
      instagram: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photographer", photographerSchema);