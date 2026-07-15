const Photo = require("../models/Photo");
const Album = require("../models/Album");

const checkPhotoOwnership = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    if (req.user.role === "admin") {
      return next();
    }

    const album = await Album.findById(photo.album);

    if (!album || album.photographer.toString() !== req.user.photographerProfile) {
      return res.status(403).json({ success: false, message: "You do not own this photo" });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = checkPhotoOwnership;