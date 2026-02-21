const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getTransactions,
  getDashboardSummary,
  deleteTransaction,
  getCategoryBreakdown,
  updateTransaction,
  getMonthlyReport,
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

// Create Income / Expense
router.post("/", protect, createTransaction);

// Get all transactions
router.get("/", protect, getTransactions);

// Dashboard summary
router.get("/summary", protect, getDashboardSummary);

// Category breakdown
router.get("/category-breakdown", protect, getCategoryBreakdown);

// Update transaction (dynamic)
router.put("/:id", protect, updateTransaction);

// Delete transaction (dynamic)
router.delete("/:id", protect, deleteTransaction);

router.get("/monthly-report", protect, getMonthlyReport);

module.exports = router;