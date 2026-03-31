const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { saveReport } = require('../controllers/reportController');

router.post('/save', authMiddleware, saveReport);

module.exports = router;
