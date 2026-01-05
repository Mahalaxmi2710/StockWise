const ActivityLog = require("../models/ActivityLog");
const Household = require("../models/Household");

// Get all activity logs for a household with optional filters
exports.getHouseholdActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { householdId } = req.params;
    const { limit = 50, action, entityType } = req.query; // query params for filtering

    // Check if household exists
    const household = await Household.findById(householdId);
    if (!household) return res.status(404).json({ message: "Household not found" });

    // Check if user is a member
    const member = household.members.find(m => m.userId.toString() === userId);
    if (!member) return res.status(403).json({ message: "You are not a member of this household" });

    // Build filter dynamically
    const filter = { householdId };
    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;

    // Fetch logs with optional limit and populate user info
    const logs = await ActivityLog.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activity logs", error: err.message });
  }
};
