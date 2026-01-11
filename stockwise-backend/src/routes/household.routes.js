const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  createHousehold,
  joinHousehold,
  getHouseholdById
} = require("../controllers/household.controller");

const router = express.Router();

router.post("/create", authMiddleware, createHousehold);
router.post("/join", authMiddleware, joinHousehold);
router.get("/:householdId", authMiddleware, getHouseholdById);

module.exports = router;
