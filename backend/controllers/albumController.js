const Album = require("../models/Album");

// Create a new album
exports.createAlbum = async (req, res) => {
  try {
    const album = await Album.create(req.body);
    res.status(201).json({ success: true, data: album });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all albums (supports filtering by category, only shows public albums to visitors)
exports.getAlbums = async (req, res) => {
  try {
    const { category, sort } = req.query;

    const filter = { visibility: "public" };

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    let query = Album.find(filter);

    if (sort === "newest") {
      query = query.sort({ createdAt: -1 });
    } else if (sort === "oldest") {
      query = query.sort({ createdAt: 1 });
    } else if (sort === "views") {
      query = query.sort({ views: -1 });
    }

    const albums = await query;

    res.status(200).json({ success: true, count: albums.length, data: albums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single album by ID (increments view count)
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    res.status(200).json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all albums belonging to one photographer
exports.getAlbumsByPhotographer = async (req, res) => {
  try {
    const albums = await Album.find({ photographer: req.params.photographerId });
    res.status(200).json({ success: true, count: albums.length, data: albums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an album
exports.updateAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    res.status(200).json({ success: true, data: album });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete an album
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);

    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    res.status(200).json({ success: true, message: "Album deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};