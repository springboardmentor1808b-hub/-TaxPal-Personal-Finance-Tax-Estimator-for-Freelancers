const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  calculateTax,
  replaceTaxEstimate,
  payTax,
  getTaxReminders,
} = require("../controllers/taxController");

/*
====================================
CALCULATE TAX (Estimator)
POST /api/tax/calculate
====================================
*/
router.post("/calculate", protect, calculateTax);

/*
====================================
REPLACE EXISTING TAX ESTIMATE
PUT /api/tax/replace
====================================
*/
router.put("/replace", protect, replaceTaxEstimate);

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
GET /api/tax/reminders?financialYear=2025-26
====================================
*/
router.get("/reminders", protect, getTaxReminders);

module.exports = router;