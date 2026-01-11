const express = require("express");
const router = express.Router();

const {
  getDashboardAnalytics
} = require("../controllers/dashboard.controller");

const authMiddleware = require("../middlewares/auth.middleware");

/**
 * Dashboard analytics
 * GET /api/dashboard/analytics/:householdId
 */
router.get(
  "/analytics/:householdId",
  authMiddleware,
  getDashboardAnalytics
);

module.exports = router;
