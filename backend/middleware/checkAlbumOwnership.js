const Album = require("../models/Album");

const checkAlbumOwnership = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    // Admins can bypass ownership check
    if (req.user.role === "admin") {
      return next();
    }

    // Photographer must own this album
    if (album.photographer.toString() !== req.user.photographerProfile) {
      return res.status(403).json({ success: false, message: "You do not own this album" });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = checkAlbumOwnership;