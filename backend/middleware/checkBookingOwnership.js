const Booking = require("../models/Booking");

const checkBookingOwnership = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (req.user.role === "admin") {
      return next();
    }

    if (booking.user.toString() === req.user.id) {
      return next();
    }

    if (req.user.photographerProfile && booking.photographer.toString() === req.user.photographerProfile) {
      return next();
    }

    return res.status(403).json({ success: false, message: "You do not have access to this booking" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = checkBookingOwnership;