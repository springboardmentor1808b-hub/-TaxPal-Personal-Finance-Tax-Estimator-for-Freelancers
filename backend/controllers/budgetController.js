const Budget = require('../models/Budget');

// GET /api/budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ month: -1 });
    res.json({ budgets });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/budgets
exports.createBudget = async (req, res) => {
  const { category, amount, month, description } = req.body;
  if (!category || !amount || !month) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const bud = new Budget({
      user: req.user.id,
      category,
      amount,
      month,
      description: description || '',
    });
    await bud.save();
    res.status(201).json({ budget: bud });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/budgets/:id
exports.deleteBudget = async (req, res) => {
  const { id } = req.params;
  try {
    const bud = await Budget.findById(id);
    if (!bud) return res.status(404).json({ message: 'Budget not found' });
    if (bud.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });
    await bud.remove();
    res.json({ message: 'Budget deleted', id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
