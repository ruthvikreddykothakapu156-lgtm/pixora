const Album = require("../models/Album");
const Booking = require("../models/Booking");
const Photographer = require("../models/Photographer");
const User = require("../models/User");

// Photographer's own dashboard stats
exports.getPhotographerDashboard = async (req, res) => {
  try {
    const photographerId = req.user.photographerProfile;

    if (!photographerId) {
      return res.status(400).json({ success: false, message: "No linked photographer profile" });
    }

    const photographer = await Photographer.findById(photographerId);
    const albums = await Album.find({ photographer: photographerId }).sort({ views: -1 });
    const bookings = await Booking.find({ photographer: photographerId });

    const totalAlbumViews = albums.reduce((sum, album) => sum + album.views, 0);
    const topAlbums = albums.slice(0, 5).map((a) => ({
      id: a._id,
      title: a.title,
      views: a.views,
    }));

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
    const completedBookings = bookings.filter((b) => b.status === "completed").length;
    const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;
    const pendingBookings = bookings.filter((b) => b.status === "pending").length;

    const conversionRate =
      totalBookings > 0 ? (((confirmedBookings + completedBookings) / totalBookings) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        profileViews: photographer.views,
        totalAlbumViews,
        totalAlbums: albums.length,
        topAlbums,
        bookingStats: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          conversionRatePercent: conversionRate,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin dashboard stats
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPhotographers = await Photographer.countDocuments();
    const totalVisitors = await User.countDocuments({ role: "visitor" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const bannedUsers = await User.countDocuments({ isBanned: true });

    const pendingVerification = await Photographer.countDocuments({ isVerified: false });
    const verifiedPhotographers = await Photographer.countDocuments({ isVerified: true });

    const totalAlbums = await Album.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusBreakdown = {};
    bookingsByStatus.forEach((item) => {
      statusBreakdown[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          visitors: totalVisitors,
          photographers: totalPhotographers,
          admins: totalAdmins,
          banned: bannedUsers,
        },
        photographers: {
          total: totalPhotographers,
          pendingVerification,
          verified: verifiedPhotographers,
        },
        albums: {
          total: totalAlbums,
        },
        bookings: {
          total: totalBookings,
          byStatus: statusBreakdown,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};