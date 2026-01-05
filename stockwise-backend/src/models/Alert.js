const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    householdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },

    inventoryItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
    },

    alertType: {
      type: String,
      enum: ["EXPIRY_7_DAYS", "EXPIRY_3_DAYS", "EXPIRY_1_DAY"],
      required: true,
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true,
      default: "MEDIUM",
    },

    message: {
      type: String,
      required: true,
    },

    acknowledged: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["PENDING", "SENT"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
