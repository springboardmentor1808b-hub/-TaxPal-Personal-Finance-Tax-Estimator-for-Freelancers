const express = require('express');
const { chatAssistant } = require('../controllers/ai.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/chat', protect, chatAssistant);

module.exports = router;