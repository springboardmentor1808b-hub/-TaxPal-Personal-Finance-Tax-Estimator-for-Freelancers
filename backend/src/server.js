const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const taxRoutes = require("./routes/taxRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Security
app.use(helmet());
app.use(cors());

// Body parser
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("TaxPal API Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/reports", reportRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});