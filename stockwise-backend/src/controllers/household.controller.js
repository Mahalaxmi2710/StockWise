const Household = require("../models/Household");
const User = require("../models/User");
const crypto = require("crypto");
const logActivity = require("../utils/activityLogger"); 


/*CREATE HOUSEHOLD Logged-in user becomes OWNER*/
exports.createHousehold = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId).select("name");


    if (!name) {
      return res.status(400).json({ message: "Household name is required" });
    }

    // Generate invite code
    const inviteCode = crypto.randomBytes(4).toString("hex");

    // Create household
    const household = await Household.create({
      name,
      inviteCode,
      createdBy: userId,
      members: [
        {
          userId,
          role: "OWNER",
        },
      ],
    });

    // Add household to user
    await User.findByIdAndUpdate(userId, {
      $push: {
        households: {
          householdId: household._id,
          role: "OWNER",
        },
      },
    });

    await logActivity({
      householdId: household._id,
      userId,
      action: "HOUSEHOLD_CREATED",
      entityType: "HOUSEHOLD",
      entityId: household._id,
      message: `${user.name} created household "${household.name}"`,

    });

    await logActivity({
      householdId: household._id,
      userId,
      action: "USER_JOINED",
      entityType: "HOUSEHOLD",
      entityId: household._id,
      message: `${user.name} joined household "${household.name} as Owner"`,
    });

    res.status(201).json({
      message: "Household created successfully",
      householdId: household._id,
      inviteCode: household.inviteCode,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create household",
      error: err.message,
    });
  }
};

/*JOIN HOUSEHOLD USING INVITE CODE User becomes VIEWER by default*/
exports.joinHousehold = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId).select("name");

    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code is required" });
    }

    const household = await Household.findOne({
      inviteCode,
      status: "ACTIVE",
    });

    if (!household) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    // Check if user already in household
    const alreadyMember = household.members.some(
      (m) => m.userId.toString() === userId
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User already a member of this household",
      });
    }

    // Add user to household
    household.members.push({
      userId,
      role: "VIEWER",
    });

    await household.save();

    // Add household to user
    await User.findByIdAndUpdate(userId, {
      $push: {
        households: {
          householdId: household._id,
          role: "VIEWER",
        },
      },
    });

    await logActivity({
      householdId: household._id,
      userId,
      action: "USER_JOINED",
      entityType: "HOUSEHOLD",
      entityId: household._id,
      message: `${user.name} joined household "${household.name}"`,
    });

    res.json({
      message: "Joined household successfully",
      householdId: household._id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to join household",
      error: err.message,
    });
  }
};
