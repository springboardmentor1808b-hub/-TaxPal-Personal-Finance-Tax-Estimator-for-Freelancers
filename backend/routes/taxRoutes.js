const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
const { saveTaxEstimate } = require('../controllers/taxController'); 

router.post('/save', authMiddleware, saveTaxEstimate);

module.exports = router;