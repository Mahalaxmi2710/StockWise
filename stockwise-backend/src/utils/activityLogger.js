const ActivityLog = require("../models/ActivityLog");

/**
 * Log an activity for a household
 */
const logActivity = async ({
  householdId,
  userId = null, // null for system/cron events
  action,
  entityType,
  entityId,
  message,
  metadata = {},
}) => {
  try {
    await ActivityLog.create({
      householdId,
      userId,
      action,
      entityType,
      entityId,
      message,
      metadata,
    });
  } catch (err) {
    // Do NOT throw — activity logs must never break main logic
    console.error("Activity log failed:", err.message);
  }
};

module.exports = logActivity;
