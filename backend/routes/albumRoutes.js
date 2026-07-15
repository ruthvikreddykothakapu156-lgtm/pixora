const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/auth");
const requireRole = require("../middleware/roleGuard");
const checkAlbumOwnership = require("../middleware/checkAlbumOwnership");

const {
  createAlbum,
  getAlbums,
  getAlbumById,
  getAlbumsByPhotographer,
  updateAlbum,
  deleteAlbum,
} = require("../controllers/albumController");

// Public routes
router.get("/", getAlbums);
router.get("/photographer/:photographerId", getAlbumsByPhotographer);
router.get("/:id", getAlbumById);

// Protected routes
router.post("/", verifyJWT, requireRole("photographer", "admin"), createAlbum);
router.put("/:id", verifyJWT, requireRole("photographer", "admin"), checkAlbumOwnership, updateAlbum);
router.delete("/:id", verifyJWT, requireRole("photographer", "admin"), checkAlbumOwnership, deleteAlbum);

module.exports = router;