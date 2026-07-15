const Review = require("../models/Review");
const Booking = require("../models/Booking");

// Create a review — only allowed if the booking exists, is completed, and matches the client's email
exports.createReview = async (req, res) => {
  try {
    const { bookingId, clientEmail, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Reviews can only be submitted for completed bookings",
      });
    }

    if (booking.clientEmail !== clientEmail) {
      return res.status(403).json({
        success: false,
        message: "Email does not match the booking record",
      });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "A review has already been submitted for this booking",
      });
    }

    const review = await Review.create({
      booking: bookingId,
      photographer: booking.photographer,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all reviews for a photographer
exports.getReviewsByPhotographer = async (req, res) => {
  try {
    const reviews = await Review.find({ photographer: req.params.photographerId }).sort({
      createdAt: -1,
    });

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: avgRating,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: get top-rated photographers, ranked by average rating
exports.getTopRatedPhotographers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const topRated = await Review.aggregate([
      {
        $group: {
          _id: "$photographer",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1, reviewCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "photographers",
          localField: "_id",
          foreignField: "_id",
          as: "photographer",
        },
      },
      { $unwind: "$photographer" },
      {
        $project: {
          _id: "$photographer._id",
          name: "$photographer.name",
          location: "$photographer.location",
          coverPhoto: "$photographer.coverPhoto",
          profilePhoto: "$photographer.profilePhoto",
          specializations: "$photographer.specializations",
          priceRange: "$photographer.priceRange",
          isVerified: "$photographer.isVerified",
          averageRating: { $round: ["$averageRating", 1] },
          reviewCount: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, count: topRated.length, data: topRated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review (admin only, for moderation)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};