const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    householdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      ],
      required: true,
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
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
