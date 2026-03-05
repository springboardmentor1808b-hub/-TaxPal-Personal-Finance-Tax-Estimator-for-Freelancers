const Budget = require("../models/budget.model");
const { TransactionModel: Transaction } = require("../models/user.model");


exports.createBudget = async (req, res) => {
    try {
        const { category, limit } = req.body;
        
        // if exists update the limit
        let budget = await Budget.findOne({ user: req.user._id, category });
        
        if (budget) {
            budget.limit = limit;
            await budget.save();
        } else {
            budget = await Budget.create({
                user: req.user._id,
                category,
                limit
            });
        }

        res.status(201).json({ success: true, data: budget });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Budget with spending progress ---
exports.getBudgets = async (req, res) => {
    try {
        const userId = req.user._id;

        const budgets = await Budget.find({ user: userId });

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const expensesThisMonth = await Transaction.aggregate([
            { 
                $match: { 
                    user: userId, 
                    type: 'expense',
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                } 
            },
            { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } }
        ]);

        const budgetProgress = budgets.map(budget => {
            const expenseItem = expensesThisMonth.find(e => e._id === budget.category);
            const spent = expenseItem ? expenseItem.totalSpent : 0;
            
            return {
                _id: budget._id,
                category: budget.category,
                limit: budget.limit,
                spent: spent
            };
        });

        res.status(200).json({ success: true, data: budgetProgress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};