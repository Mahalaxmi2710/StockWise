const cron = require("node-cron");
const InventoryItem = require("../models/InventoryItem");
const Alert = require("../models/Alert");
const logActivity = require("../utils/activityLogger");

console.log("Expiry cron file loaded");


const DAY_IN_MS = 24 * 60 * 60 * 1000;

cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running expiry check cron job");

  try {
    const items = await InventoryItem.find({ status: "ACTIVE" });

    const today = new Date();

    for (const item of items) {
      const daysLeft = Math.ceil(
        (item.expiryDate - today) / DAY_IN_MS
      );

      // Item expired
      if (daysLeft <= 0) {
        item.status = "EXPIRED";
        await item.save();
        continue;
      }

      let alertType = null;
      let severity = null;

      if (daysLeft === 7) {
        alertType = "EXPIRY_7_DAYS";
        severity = "LOW";
      } else if (daysLeft === 3) {
        alertType = "EXPIRY_3_DAYS";
        severity = "MEDIUM";
      } else if (daysLeft === 1) {
        alertType = "EXPIRY_1_DAY";
        severity = "HIGH";
      }

      if (!alertType) continue;

      // Prevent duplicate alerts
      const existingAlert = await Alert.findOne({
        inventoryItemId: item._id,
        alertType,
      });

      if (existingAlert) continue;

      const alert=await Alert.create({
        householdId: item.householdId,
        inventoryItemId: item._id,
        alertType,
        severity,
        message: `${item.name} is expiring in ${daysLeft} day(s).`,
        status: "PENDING",
      });

      await logActivity({
          householdId: item.householdId,
          userId: null, // system event
          action: "ALERT_TRIGGERED",
          entityType: "ALERT",
          entityId: alert._id,
          message: `Expiry alert created for "${item.name}" by system cron`,
        });
    }
  } catch (err) {
    console.error("❌ Expiry cron error:", err.message);
  }
});
