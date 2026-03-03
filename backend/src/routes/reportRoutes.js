const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getIncomeReport,
  getExpenseReport,
  getIncomeExpenseReport,
  getTaxReport,
  exportIncomeCSV,
  exportExpenseCSV,
  exportTaxCSV
} = require("../controllers/reportController");

router.get("/income", protect, getIncomeReport);
router.get("/expense", protect, getExpenseReport);
router.get("/income-expense", protect, getIncomeExpenseReport);
router.get("/tax", protect, getTaxReport);
router.get("/income/csv", protect, exportIncomeCSV);
router.get("/expense/csv", protect, exportExpenseCSV);
router.get("/tax/csv", protect, exportTaxCSV);
module.exports = router;