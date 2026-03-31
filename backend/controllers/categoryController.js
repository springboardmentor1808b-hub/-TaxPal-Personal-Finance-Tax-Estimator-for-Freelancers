const Category = require('../models/Category');

// return default categories (copied from frontend defaults) to use when seeding
const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Business Expenses', type: 'expense', color: '#6366f1' },
  { name: 'Office Rent', type: 'expense', color: '#8b5cf6' },
  { name: 'Software Subscriptions', type: 'expense', color: '#ec4899' },
  { name: 'Professional Development', type: 'expense', color: '#f43f5e' },
  { name: 'Marketing', type: 'expense', color: '#f97316' },
  { name: 'Travel', type: 'expense', color: '#22c55e' },
  { name: 'Meals & Entertainment', type: 'expense', color: '#14b8a6' },
  { name: 'Utilities', type: 'expense', color: '#3b82f6' },
];

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    let cats = await Category.find({ user: req.user.id });
    if (cats.length === 0) {
      // seed defaults for new users
      cats = await Category.insertMany(
        DEFAULT_EXPENSE_CATEGORIES.map((c) => ({
          ...c,
          user: req.user.id,
        }))
      );
    }
    res.json({ categories: cats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/categories
exports.createCategory = async (req, res) => {
  const { name, type, color } = req.body;
  if (!name || !type || !color) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existing = await Category.findOne({ user: req.user.id, name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    const cat = new Category({ user: req.user.id, name, type, color });
    await cat.save();
    res.status(201).json({ category: cat });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    if (cat.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    Object.assign(cat, updates);
    await cat.save();
    res.json({ category: cat });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    if (cat.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    await cat.remove();
    res.json({ message: 'Category deleted', id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
