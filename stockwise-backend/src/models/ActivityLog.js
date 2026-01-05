const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    householdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: false,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    action: {
      type: String,
      enum: [
        "HOUSEHOLD_CREATED",
        "USER_JOINED",
        "ITEM_ADDED",
        "ITEM_UPDATED",
        "ITEM_EXPIRED",
        "ALERT_TRIGGERED",
        "USER_LOGIN",
        "USER_SIGNUP",
        "ITEM_CONSUMED",
        "ALERT_ACKNOWLEDGED",
        "ITEM_DELETED"
      ],
      required: true,
      index: true,
    },

    entityType: {
      type: String,
      enum: ["INVENTORY", "ALERT", "HOUSEHOLD", "USER"],
      required: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

activityLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
