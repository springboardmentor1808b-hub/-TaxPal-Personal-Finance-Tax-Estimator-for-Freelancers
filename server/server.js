const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const protect = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');
// const logger = require('./utils/logger'); 

dotenv.config();

connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Test Routes
app.get("/", (req, res) => {
  res.send("TaxPal Backend Running 🚀");
});

// Protected Route
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You accessed protected route", user: req.user });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // if (logger) logger.info(`Server running on port ${PORT}`);
});

// Extra Security: Handle For Unexpected errors
process.on('unhandledRejection', (reason) => {
  console.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});