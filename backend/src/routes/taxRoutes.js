
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { calculateTax } = require("../controllers/taxController");

router.post("/calculate", protect, calculateTax);

module.exports = router;