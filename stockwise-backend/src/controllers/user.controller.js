const User = require("../models/User");

/*GET /api/users/session Frontend session hydration*/
exports.getSessionUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("households.householdId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch session user",
      error: err.message,
    });
  }
};
