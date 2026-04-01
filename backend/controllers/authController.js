const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      country,
      incomeBracket,
    } = req.body;

    // Validation
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !country ||
      !incomeBracket
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      country,
      incomeBracket,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        country: user.country,
        incomeBracket: user.incomeBracket,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        country: user.country,
        incomeBracket: user.incomeBracket,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { fullName, email, country, incomeBracket } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        fullName,
        email,
        country,
        incomeBracket,
      },
      {  returnDocument: "after" }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        country: user.country,
        incomeBracket: user.incomeBracket,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
