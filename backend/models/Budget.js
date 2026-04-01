const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
    description: { type: String, default: '' },
    spent: { type: Number, default: 0 },
    status: { type: String, default: 'On Track' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', BudgetSchema);
