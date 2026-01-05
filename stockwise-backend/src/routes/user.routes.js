const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { getSessionUser } = require("../controllers/user.controller");

const router = express.Router();

router.get("/session", authMiddleware, getSessionUser);

module.exports = router;
