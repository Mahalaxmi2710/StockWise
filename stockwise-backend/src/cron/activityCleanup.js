const cron = require("node-cron");
const ActivityLog = require("../models/ActivityLog");

cron.schedule("0 0 * * *", async () => { // runs every day at 00:00
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await ActivityLog.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
    console.log(`Activity Cleanup: Deleted ${result.deletedCount} old logs`);
  } catch (err) {
    console.error("Activity Cleanup failed:", err.message);
  }
});
