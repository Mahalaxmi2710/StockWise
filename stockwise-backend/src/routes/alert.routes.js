const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const {
  getAlerts,
  acknowledgeAlert,
} = require("../controllers/alert.controller");

// All alert routes are protected
router.use(authMiddleware);

/**
 * GET all alerts for logged-in user
 * GET /api/alerts
 */
router.get("/", getAlerts);

/**
 * Acknowledge an alert
 * PATCH /api/alerts/:alertId/acknowledge
 */
router.patch("/:alertId/acknowledge", acknowledgeAlert);

module.exports = router;
