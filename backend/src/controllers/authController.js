const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");



const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


exports.registerUser = async (req, res) => {
  try {
    // Read validation errors from routes
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      country,
      incomeBracket,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create user (password auto hashed in model)
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      country,
      incomeBracket,
    });

    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        token,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};



exports.loginUser = async (req, res) => {
  try {
    // Read validation errors from routes
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Explicitly select password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password using model method
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
  success: true,
  user: {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  },
  token,
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};
