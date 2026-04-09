const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

// Helper: generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    // Don't allow admin signup via API
    if (role === "admin") {
      return res.status(403).json({ message: "Cannot create admin account via signup." });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup.", detail: err.message });
  }
});


// POST /api/auth/signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user);

    res.json({
      message: "Signed in successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopId: user.shopId,
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error during signin.", detail: err.message });
  }
});


// GET /api/auth/me — get current user info
router.get("/me", verifyToken, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      shopId: req.user.shopId,
    },
  });
});

// POST /api/auth/register-shop — shopkeeper registers their ONE shop
router.post("/register-shop", verifyToken, async (req, res) => {
  try {
    // Only shopkeepers can register a shop
    if (req.user.role !== "shopkeeper") {
      return res.status(403).json({ message: "Only shopkeepers can register a shop." });
    }

    // Re-fetch user from DB to get the latest shopId
    const freshUser = await User.findById(req.user._id);

    // Enforce one-shop-per-account
    if (freshUser.shopId) {
      return res.status(409).json({
        message: "You already have a registered shop. One account can only have one shop.",
      });
    }

    // Create the restaurant/shop
    const Restaurant = require("../models/Restaurant");
    const restaurant = await Restaurant.create(req.body);

    // Link the shop to this user
    freshUser.shopId = restaurant._id;
    await freshUser.save();

    // Issue a new token with the shopId included
    const token = generateToken(freshUser);

    res.status(201).json({
      message: "Shop registered successfully!",
      token,
      user: {
        id: freshUser._id,
        name: freshUser.name,
        email: freshUser.email,
        role: freshUser.role,
        shopId: freshUser.shopId,
      },
      shop: restaurant,
    });
  } catch (err) {
    console.error("Register shop error:", err);
    res.status(500).json({ message: "Failed to register shop.", detail: err.message });
  }
});

module.exports = router;

