const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getTransactions,
  getDashboardSummary,
  deleteTransaction,
  getCategoryBreakdown,
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");



// Create Income / Expense
router.post("/", protect, createTransaction);

// Get all transactions of logged user
router.get("/", protect, getTransactions);

// Dashboard summary
router.get("/summary", protect, getDashboardSummary);

// Delete transaction
router.delete("/:id", protect, deleteTransaction);
// Category breakdown
router.get("/category-breakdown", protect, getCategoryBreakdown);

module.exports = router;