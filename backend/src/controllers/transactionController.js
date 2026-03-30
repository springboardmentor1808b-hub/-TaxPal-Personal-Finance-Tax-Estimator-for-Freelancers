const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

/*
====================================
CREATE TRANSACTION (Income / Expense)
POST /api/transactions
====================================
*/
exports.createTransaction = async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;

    if (!type || !category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      category,
      amount,
      date,
    });

    res.status(201).json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Transaction creation failed" });
  }
};

/*
====================================
GET ALL TRANSACTIONS (Pagination + Date Filter)
GET /api/transactions
====================================
*/
exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

/*
====================================
MONTHLY REPORT
GET /api/transactions/monthly
====================================
*/
exports.getMonthlyReport = async (req, res) => {
  try {
    const report = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ success: true, report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Monthly report failed" });
  }
};

/*
====================================
DASHBOARD SUMMARY
GET /api/transactions/summary
====================================
*/
exports.getDashboardSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    res.json({
      success: true,
      income,
      expense,
      netWorth: income - expense,
      totalTransactions: transactions.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Summary calculation failed" });
  }
};

/*
====================================
CATEGORY BREAKDOWN (Pie Chart)
GET /api/transactions/category
====================================
*/
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const categories = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({ success: true, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Category breakdown failed" });
  }
};
/*
====================================
UPDATE TRANSACTION
PUT /api/transactions/:id
====================================
*/
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    if (transaction.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    Object.assign(transaction, req.body);

    await transaction.save();

    res.json({ success: true, transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

/*
====================================
DELETE TRANSACTION
DELETE /api/transactions/:id
====================================
*/
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    if (transaction.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    await transaction.deleteOne();

    res.json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};