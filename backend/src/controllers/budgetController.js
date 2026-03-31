const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

/*
====================================
CREATE BUDGET
POST /api/budgets
====================================
*/
exports.createBudget = async (req, res) => {
  try {
    const { category, budgetAmount, month, description } = req.body;

    if (!category || !budgetAmount || !month) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category,
      budgetAmount,
      month,
      description,
    });

    res.status(201).json({ success: true, budget });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Budget already exists for this category & month",
      });
    }
    res.status(500).json({ message: "Budget creation failed" });
  }
};

/*
====================================
GET ALL BUDGETS WITH SPENT + STATUS
GET /api/budgets
====================================
*/
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    const result = [];

    for (let b of budgets) {
      const start = new Date(`${b.month}-01T00:00:00Z`); // UTC Date fix
      const end = new Date(start);
      end.setUTCMonth(end.getUTCMonth() + 1);

      const expense = await Transaction.aggregate([
        {
          $match: {
            user: b.user,
            // ✅ CHANGE HERE: Case-insensitive matching
            category: { $regex: new RegExp(`^${b.category}$`, "i") },
            type: "expense",
            date: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const spent = expense[0]?.total || 0;
      const remaining = b.budgetAmount - spent;

      let status = "Good";
      if (remaining < 0) status = "Exceeded";
      else if (remaining < b.budgetAmount * 0.2) status = "Warning";

      result.push({
        _id: b._id,
        category: b.category,
        month: b.month,
        budget: b.budgetAmount,
        spent,
        remaining,
        status,
        description: b.description,
      });
    }

    res.json({ success: true, budgets: result });
  } catch (error) {
    res.status(500).json({ message: "Fetching budgets failed" });
  }
};

/*
====================================
GET SINGLE BUDGET
GET /api/budgets/:id
====================================
*/
exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    if (budget.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });
    res.json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

/*
====================================
UPDATE BUDGET
PUT /api/budgets/:id
====================================
*/
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    if (budget.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    const { category, budgetAmount, month, description } = req.body;
    budget.category = category || budget.category;
    budget.budgetAmount = budgetAmount ?? budget.budgetAmount;
    budget.month = month || budget.month;
    budget.description = description || budget.description;

    await budget.save();
    res.json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

/*
====================================
DELETE BUDGET
DELETE /api/budgets/:id
====================================
*/
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    if (budget.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    await budget.deleteOne();
    res.json({ success: true, message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/*
====================================
BUDGET SUMMARY (Dashboard)
GET /api/budgets/summary
====================================
*/
exports.getBudgetSummary = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    let totalBudget = 0;
    let totalSpent = 0;

    for (let b of budgets) {
      totalBudget += b.budgetAmount;
      const start = new Date(`${b.month}-01T00:00:00Z`);
      const end = new Date(start);
      end.setUTCMonth(end.getUTCMonth() + 1);

      const expense = await Transaction.aggregate([
        {
          $match: {
            user: b.user,
            // ✅ CHANGE HERE: Case-insensitive matching
            category: { $regex: new RegExp(`^${b.category}$`, "i") },
            type: "expense",
            date: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);
      totalSpent += expense[0]?.total || 0;
    }

    res.json({
      success: true,
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
    });
  } catch (error) {
    res.status(500).json({ message: "Summary failed" });
  }
};

/*
====================================
BUDGET ALERTS (Exceeded)
GET /api/budgets/alerts
====================================
*/
exports.getBudgetAlerts = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    const alerts = [];

    for (let b of budgets) {
      const start = new Date(`${b.month}-01T00:00:00Z`);
      const end = new Date(start);
      end.setUTCMonth(end.getUTCMonth() + 1);

      const expense = await Transaction.aggregate([
        {
          $match: {
            user: b.user,
            // ✅ CHANGE HERE: Case-insensitive matching
            category: { $regex: new RegExp(`^${b.category}$`, "i") },
            type: "expense",
            date: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const spent = expense[0]?.total || 0;
      if (spent > b.budgetAmount) {
        alerts.push({
          category: b.category,
          month: b.month,
          spent,
          budget: b.budgetAmount,
        });
      }
    }
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ message: "Alert check failed" });
  }
};