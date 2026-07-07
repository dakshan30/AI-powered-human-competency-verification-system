const express = require("express");
const router = express.Router();
const {
  getDashboardAnalytics,
  getAnalytics
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

/*
====================================
ANALYTICS ROUTING
====================================
*/

// GET /api/analytics/dashboard
// Exposes database-level aggregated metrics, distributions, and trends. Secure route.
router.get("/dashboard", protect, getDashboardAnalytics);

// GET /api/analytics
// Exposes basic pre-fetched metrics for legacy reports page. Secure route.
router.get("/", protect, getAnalytics);

module.exports = router;