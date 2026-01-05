const User = require("../models/User");
const logActivity = require("../utils/activityLogger"); 

const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user (NO household yet)
    const user = await User.create({
      name,
      email,
      passwordHash,
      households: [],
    });

    await logActivity({
      householdId: null,          // No household yet
      userId: user._id,
      action: "USER_SIGNUP",
      entityType: "USER",
      entityId: user._id,
      message: `User "${user.name}" signed up`,
    });


    // Generate JWT
    const token = generateToken({
      userId: user._id,
      email: user.email,
    });

    res.status(201).json({
      message: "Signup successful",
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Signup failed",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, status: "ACTIVE" });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.lastLoginAt = new Date();
    await user.save();

     await logActivity({
      householdId: null,          // Not tied to a household
      userId: user._id,
      action: "USER_LOGIN",
      entityType: "USER",
      entityId: user._id,
      message: `User "${user.name}" logged in`,
    });

    const token = generateToken({
      userId: user._id,
      email: user.email,
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
