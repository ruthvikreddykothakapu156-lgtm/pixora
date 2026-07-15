const Photographer = require("../models/Photographer");
const { uploadBufferToCloudinary } = require("./photoController");

// Get all photographers (supports filtering and sorting)
exports.getPhotographers = async (req, res) => {
  try {
    const { location, specialization, sort } = req.query;

    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (specialization) {
      filter.specializations = { $regex: specialization, $options: "i" };
    }

    let query = Photographer.find(filter);

    if (sort === "newest") {
      query = query.sort({ createdAt: -1 });
    } else if (sort === "oldest") {
      query = query.sort({ createdAt: 1 });
    } else if (sort === "name") {
      query = query.sort({ name: 1 });
    }

    const photographers = await query;

    res.status(200).json({ success: true, count: photographers.length, data: photographers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search photographers by a general query (name, location, or specialization)
exports.searchPhotographers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: "Search query 'q' is required" });
    }

    const photographers = await Photographer.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { specializations: { $regex: q, $options: "i" } },
      ],
    });

    res.status(200).json({ success: true, count: photographers.length, data: photographers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single photographer by ID (increments view count)
exports.getPhotographerById = async (req, res) => {
  try {
    const photographer = await Photographer.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!photographer) {
      return res.status(404).json({ success: false, message: "Photographer not found" });
    }

    res.status(200).json({ success: true, data: photographer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update photographer profile
exports.updatePhotographer = async (req, res) => {
  try {
    const photographer = await Photographer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!photographer) {
      return res.status(404).json({ success: false, message: "Photographer not found" });
    }

    res.status(200).json({ success: true, data: photographer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete photographer (admin only)
exports.deletePhotographer = async (req, res) => {
  try {
    const photographer = await Photographer.findByIdAndDelete(req.params.id);

    if (!photographer) {
      return res.status(404).json({ success: false, message: "Photographer not found" });
    }

    res.status(200).json({ success: true, message: "Photographer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload/update photographer's payment QR code
exports.uploadQrCode = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, "qr_codes");

    const photographer = await Photographer.findByIdAndUpdate(
      req.params.id,
      { qrCodeImage: result.secure_url },
      { new: true }
    );

    if (!photographer) {
      return res.status(404).json({ success: false, message: "Photographer not found" });
    }

    res.status(200).json({ success: true, data: photographer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Upload/update profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, "profile_photos");

    const photographer = await Photographer.findByIdAndUpdate(
      req.params.id,
      { profilePhoto: result.secure_url },
      { new: true }
    );

    if (!photographer) {
      return res.status(404).json({ success: false, message: "Photographer not found" });
    }

    res.status(200).json({ success: true, data: photographer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Upload/update cover photo
exports.uploadCoverPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, "cover_photos");

    const photographer = await Photographer.findByIdAndUpdate(
      req.params.id,
      { coverPhoto: result.secure_url },
      { new: true }
    );

    if (!photographer) {
      return res.status(404).json({ success: false, message: "Photographer not found" });
    }

    res.status(200).json({ success: true, data: photographer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};