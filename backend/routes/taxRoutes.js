const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { saveTaxEstimate, getTaxEstimates, addTaxPayment } = require('../controllers/taxController');

router.post('/save', authMiddleware, saveTaxEstimate);
router.get('/', authMiddleware, getTaxEstimates);
router.post('/payment', authMiddleware, addTaxPayment);

module.exports = router;