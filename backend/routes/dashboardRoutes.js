const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/auth");
const requireRole = require("../middleware/roleGuard");

const { getPhotographerDashboard, getAdminDashboard } = require("../controllers/dashboardController");

router.get("/photographer", verifyJWT, requireRole("photographer", "admin"), getPhotographerDashboard);
router.get("/admin", verifyJWT, requireRole("admin"), getAdminDashboard);

module.exports = router;