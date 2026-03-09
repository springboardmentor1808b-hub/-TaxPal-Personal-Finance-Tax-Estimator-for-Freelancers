const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getBudgets,
  createBudget,
  deleteBudget,
} = require('../controllers/budgetController');

router.get('/', auth, getBudgets);
router.post('/', auth, createBudget);
router.delete('/:id', auth, deleteBudget);

module.exports = router;
