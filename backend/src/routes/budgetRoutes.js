const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
  getBudgetAlerts,
} = require("../controllers/budgetController");

// All routes protected
router.use(protect);

// CREATE BUDGET
router.post("/", createBudget);

// GET ALL BUDGETS (table view)
router.get("/", getBudgets);

// DASHBOARD SUMMARY CARD
router.get("/summary", getBudgetSummary);

// ALERTS (exceeded budgets)
router.get("/alerts", getBudgetAlerts);

// SINGLE BUDGET
router.get("/:id", getBudgetById);

// UPDATE
router.put("/:id", updateBudget);

// DELETE
router.delete("/:id", deleteBudget);

module.exports = router;