const Booking = require("../models/Booking");
const cloudinary = require("../config/cloudinary");
const { uploadBufferToCloudinary } = require("./photoController");

// Create a new booking inquiry (requires login)
exports.createBooking = async (req, res) => {
  try {
    const { photographer, eventDate, endDate } = req.body;

    const start = new Date(eventDate);
    const end = new Date(endDate || eventDate);

    if (end < start) {
      return res.status(400).json({ success: false, message: "End date cannot be before start date" });
    }

    const overlapping = await Booking.findOne({
      photographer: photographer,
      status: "confirmed",
      eventDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: "This photographer is already booked during part of the selected dates",
      });
    }

    const booking = await Booking.create({
      ...req.body,
      eventDate: start,
      endDate: end,
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all bookings (admin only)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings for one photographer
exports.getBookingsByPhotographer = async (req, res) => {
  try {
    const bookings = await Booking.find({ photographer: req.params.photographerId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings made by the currently logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: get confirmed booking date ranges for a photographer (no personal details exposed)
exports.getAvailability = async (req, res) => {
  try {
    const bookings = await Booking.find({
      photographer: req.params.photographerId,
      status: "confirmed",
    }).select("eventDate endDate -_id");

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (status === "confirmed") {
      const overlapping = await Booking.findOne({
        _id: { $ne: booking._id },
        photographer: booking.photographer,
        status: "confirmed",
        eventDate: { $lte: booking.endDate },
        endDate: { $gte: booking.eventDate },
      });

      if (overlapping) {
        return res.status(400).json({
          success: false,
          message: "Another confirmed booking overlaps with these dates",
        });
      }
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Client submits a payment screenshot for their booking
exports.submitPaymentScreenshot = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No screenshot uploaded" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, "payment_screenshots");

    booking.paymentScreenshot = result.secure_url;
    booking.paymentStatus = "pending_verification";
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Photographer/admin verifies or rejects a payment
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!["verified", "rejected"].includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid payment status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.paymentStatus !== "pending_verification") {
      return res.status(400).json({
        success: false,
        message: "No pending payment to verify for this booking",
      });
    }

    booking.paymentStatus = paymentStatus;
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all bookings with pending payment verification, for a photographer
exports.getPendingPayments = async (req, res) => {
  try {
    const bookings = await Booking.find({
      photographer: req.params.photographerId,
      paymentStatus: "pending_verification",
    });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a booking (admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};