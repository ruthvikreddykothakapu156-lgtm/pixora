const Photo = require("../models/Photo");
const Album = require("../models/Album");
const Photographer = require("../models/Photographer");
const cloudinary = require("../config/cloudinary");
const sharp = require("sharp");

// Helper: apply a text watermark using Sharp, with custom text
const applyWatermark = async (imageBuffer, watermarkText) => {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  const text = watermarkText || "Pixora";
  const fontSize = Math.round(metadata.width / 25);

  const svgWatermark = `
    <svg width="${metadata.width}" height="${metadata.height}">
      <text
        x="98%"
        y="97%"
        font-family="Arial, sans-serif"
        font-size="${fontSize}"
        fill="white"
        fill-opacity="0.6"
        text-anchor="end"
        stroke="black"
        stroke-width="0.5"
        stroke-opacity="0.3"
      >${text}</text>
    </svg>
  `;

  const watermarkedBuffer = await image
    .composite([{ input: Buffer.from(svgWatermark), gravity: "southeast" }])
    .jpeg({ quality: 85 })
    .toBuffer();

  return watermarkedBuffer;
};

// Helper: upload a buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Upload one or more photos to an album, with watermark and optimization
exports.uploadPhoto = async (req, res) => {
  try {
    const files = req.files && req.files.length > 0 ? req.files : req.file ? [req.file] : [];

    if (files.length === 0) {
      return res.status(400).json({ success: false, message: "No file(s) uploaded" });
    }

    const { album: albumId } = req.body;

    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    const photographer = await Photographer.findById(album.photographer);
    const watermarkText = photographer ? photographer.name : "Pixora";

    const uploadedPhotos = [];

    for (const file of files) {
      const optimizedBuffer = await sharp(file.buffer)
        .resize({ width: 2000, withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      const watermarkedBuffer = await applyWatermark(optimizedBuffer, watermarkText);

      const result = await uploadBufferToCloudinary(watermarkedBuffer, "photography_portfolio");

      const photo = await Photo.create({
        album: albumId,
        url: result.secure_url,
        publicId: result.public_id,
      });

      uploadedPhotos.push(photo);
    }

    res.status(201).json({ success: true, count: uploadedPhotos.length, data: uploadedPhotos });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all photos in one album
exports.getPhotosByAlbum = async (req, res) => {
  try {
    const photos = await Photo.find({ album: req.params.albumId }).sort({ order: 1 });
    res.status(200).json({ success: true, count: photos.length, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single photo by ID
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    res.status(200).json({ success: true, data: photo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update photo tags
exports.updatePhotoTags = async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { tags: req.body.tags },
      { new: true, runValidators: true }
    );

    if (!photo) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    res.status(200).json({ success: true, data: photo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a photo (removes from Cloudinary too)
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    await cloudinary.uploader.destroy(photo.publicId);
    await Photo.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Photo deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadBufferToCloudinary = uploadBufferToCloudinary;