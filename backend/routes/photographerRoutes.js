const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/auth");
const requireRole = require("../middleware/roleGuard");
const checkPhotographerOwnership = require("../middleware/checkPhotographerOwnership");
const upload = require("../middleware/upload");

const {
  getPhotographers,
  getPhotographerById,
  updatePhotographer,
  deletePhotographer,
  searchPhotographers,
  uploadQrCode,
  uploadProfilePhoto,
  uploadCoverPhoto,
} = require("../controllers/photographerController");

router.get("/search", searchPhotographers);
router.get("/", getPhotographers);
router.get("/:id", getPhotographerById);

router.put("/:id", verifyJWT, requireRole("photographer", "admin"), checkPhotographerOwnership, updatePhotographer);

router.post(
  "/:id/qr-code",
  verifyJWT,
  requireRole("photographer", "admin"),
  checkPhotographerOwnership,
  upload.single("qrCode"),
  uploadQrCode
);

router.post(
  "/:id/profile-photo",
  verifyJWT,
  requireRole("photographer", "admin"),
  checkPhotographerOwnership,
  upload.single("profilePhoto"),
  uploadProfilePhoto
);

router.post(
  "/:id/cover-photo",
  verifyJWT,
  requireRole("photographer", "admin"),
  checkPhotographerOwnership,
  upload.single("coverPhoto"),
  uploadCoverPhoto
);

router.delete("/:id", verifyJWT, requireRole("admin"), deletePhotographer);

module.exports = router;