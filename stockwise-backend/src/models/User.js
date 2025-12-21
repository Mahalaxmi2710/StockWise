const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    households: [
      {
        householdId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Household",
          required: true,
        },
        role: {
          type: String,
          enum: ["OWNER", "EDITOR", "VIEWER"],
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DELETED"],
      default: "ACTIVE",
    },

    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
