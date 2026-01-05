const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { getHouseholdActivity } = require("../controllers/activity.controller");

// GET /api/activity/:householdId
router.get("/:householdId", authMiddleware, getHouseholdActivity);

module.exports = router;
