const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const verifyJWT = require("../middleware/auth");
const requireRole = require("../middleware/roleGuard");
const checkPhotoOwnership = require("../middleware/checkPhotoOwnership");

const {
  uploadPhoto,
  getPhotosByAlbum,
  getPhotoById,
  updatePhotoTags,
  deletePhoto,
} = require("../controllers/photoController");

// Public routes
router.get("/album/:albumId", getPhotosByAlbum);
router.get("/:id", getPhotoById);

// Protected routes — supports up to 20 images per upload request
router.post(
  "/upload",
  verifyJWT,
  requireRole("photographer", "admin"),
  upload.array("images", 20),
  uploadPhoto
);
router.put("/:id/tags", verifyJWT, requireRole("photographer", "admin"), checkPhotoOwnership, updatePhotoTags);
router.delete("/:id", verifyJWT, requireRole("photographer", "admin"), checkPhotoOwnership, deletePhoto);

module.exports = router;