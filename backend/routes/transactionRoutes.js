const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

router.get('/', auth, getTransactions);
router.post('/', auth, createTransaction);
router.delete('/:id', auth, deleteTransaction);

module.exports = router;
