const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/auth");
const requireRole = require("../middleware/roleGuard");

const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getUserById,
  toggleUserBan,
  updateUserRole,
  deleteUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyJWT, getMe);

// Admin-only user management
router.get("/users", verifyJWT, requireRole("admin"), getAllUsers);
router.get("/users/:id", verifyJWT, requireRole("admin"), getUserById);
router.put("/users/:id/ban", verifyJWT, requireRole("admin"), toggleUserBan);
router.put("/users/:id/role", verifyJWT, requireRole("admin"), updateUserRole);
router.delete("/users/:id", verifyJWT, requireRole("admin"), deleteUser);

module.exports = router;