const Transaction = require('../models/Transaction');

// GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ transactions: txs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/transactions
exports.createTransaction = async (req, res) => {
  const { type, amount, category, description, date } = req.body;
  if (!type || !amount || !category || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const tx = new Transaction({
      user: req.user.id,
      type,
      amount,
      category,
      description: description || '',
      date: new Date(date),
    });

    await tx.save();
    res.status(201).json({ transaction: tx });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (tx.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    await tx.remove();
    res.json({ message: 'Transaction deleted', id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
