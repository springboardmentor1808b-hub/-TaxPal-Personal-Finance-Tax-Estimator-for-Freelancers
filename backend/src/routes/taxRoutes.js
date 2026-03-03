const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  calculateTax,
  payTax,
  getTaxReminders,
} = require("../controllers/taxController");

/*
====================================
CALCULATE TAX
POST /api/tax/calculate
====================================
*/
router.post("/calculate", protect, calculateTax);

/*
====================================
PAY TAX INSTALLMENT
POST /api/tax/pay/:id
====================================
*/
router.post("/pay/:id", protect, payTax);

/*
====================================
GET TAX REMINDERS
GET /api/tax/reminders?financialYear=2025-2026
====================================
*/
router.get("/reminders", protect, getTaxReminders);

module.exports = router;