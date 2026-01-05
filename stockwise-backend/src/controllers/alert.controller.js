const mongoose = require("mongoose");
const Alert = require("../models/Alert");
const User = require("../models/User");
const logActivity = require("../utils/activityLogger");


/*GET all alerts for logged-in user
 GET /api/alerts*/
exports.getAlerts = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const user = await User.findById(userId).select("households.householdId");
    const householdIds = user.households.map(h => h.householdId);

    const alerts = await Alert.find({
      householdId: { $in: householdIds },
    })
      .populate("inventoryItemId", "name expiryDate")
      .sort({ createdAt: -1 })
      .lean();

    
    const enrichedAlerts = alerts.map(alert => ({
      ...alert,
      acknowledgedByMe: alert.acknowledged?.some(id =>
        id.toString() === userId.toString()
      ),
    }));

    res.json(enrichedAlerts);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch alerts",
      error: err.message,
    });
  }
};


/*PATCH /api/alerts/:alertId/acknowledge*/
exports.acknowledgeAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    

    const alert = await Alert.findById(alertId).populate("inventoryItemId", "name");
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    // Prevent duplicate acknowledgement
    if (!alert.acknowledged.some(id => id.equals(userId))) {
      alert.acknowledged.push(userId);
      await alert.save();

      await logActivity({
        householdId: alert.householdId,
        userId,
        action: "ALERT_ACKNOWLEDGED",
        entityType: "ALERT",
        entityId: alert._id,
        message: `Alert for item "${alert.inventoryItemId.name}" acknowledged`,
      });

    }

    res.json({ message: "Alert acknowledged" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to acknowledge alert",
      error: err.message,
    });
  }
}
