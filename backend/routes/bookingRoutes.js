const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const verifyJWT = require("../middleware/auth");
const requireRole = require("../middleware/roleGuard");
const checkBookingOwnership = require("../middleware/checkBookingOwnership");
const {
  createBooking,
  getBookings,
  getBookingById,
  getBookingsByPhotographer,
  updateBookingStatus,
  deleteBooking,
  getMyBookings,
  submitPaymentScreenshot,
  updatePaymentStatus,
  getPendingPayments,
  getAvailability,
} = require("../controllers/bookingController");

// Requires login — any logged-in user can book
router.post("/", verifyJWT, createBooking);

// Requires login — client views their own booking history
router.get("/my-bookings", verifyJWT, getMyBookings);

// Admin only — full list
router.get("/", verifyJWT, requireRole("admin"), getBookings);

// Photographer/admin — pending payments
router.get(
  "/photographer/:photographerId/pending-payments",
  verifyJWT,
  requireRole("photographer", "admin"),
  getPendingPayments
);

// Public — availability calendar, no login needed
router.get("/photographer/:photographerId/availability", getAvailability);

// Photographer/admin — bookings for a specific photographer
router.get(
  "/photographer/:photographerId",
  verifyJWT,
  requireRole("photographer", "admin"),
  getBookingsByPhotographer
);

// Client or photographer (owner) or admin — single booking
router.get("/:id", verifyJWT, checkBookingOwnership, getBookingById);

// Photographer/admin — update status
router.put("/:id/status", verifyJWT, requireRole("photographer", "admin"), updateBookingStatus);

// Requires login — client submits payment proof for their own booking
router.post(
  "/:id/payment-screenshot",
  verifyJWT,
  checkBookingOwnership,
  upload.single("screenshot"),
  submitPaymentScreenshot
);

// Photographer/admin — verify/reject payment
router.put("/:id/payment-status", verifyJWT, requireRole("photographer", "admin"), updatePaymentStatus);

// Admin only — delete
router.delete("/:id", verifyJWT, requireRole("admin"), deleteBooking);

module.exports = router;