const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/auth");
const requireRole = require("../middleware/roleGuard");

const {
  createReview,
  getReviewsByPhotographer,
  getTopRatedPhotographers,
  deleteReview,
} = require("../controllers/reviewController");

// Public — anyone with a valid completed booking can leave a review
router.post("/", createReview);

// Public — top-rated photographers (must come before dynamic :photographerId route)
router.get("/top-rated", getTopRatedPhotographers);

// Public — anyone can view a photographer's reviews
router.get("/photographer/:photographerId", getReviewsByPhotographer);

// Admin only — moderate/remove inappropriate reviews
router.delete("/:id", verifyJWT, requireRole("admin"), deleteReview);

module.exports = router;