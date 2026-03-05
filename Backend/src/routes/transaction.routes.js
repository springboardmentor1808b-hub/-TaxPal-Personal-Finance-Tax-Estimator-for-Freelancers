const express = require("express");
const { createTransaction, getDashboardStats, getAllTransactions } = require("../controllers/transaction.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Protected routes
router.post("/", protect, createTransaction);
router.get("/dashboard-stats", protect, getDashboardStats);
router.get("/", protect, getAllTransactions);

module.exports = router;