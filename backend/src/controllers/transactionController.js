const Transaction = require("../models/Transaction");


// CREATE TRANSACTION (Income/Expense)


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


// GET ALL USER TRANSACTIONS

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ date: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};



// DASHBOARD SUMMARY

exports.getDashboardSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    res.json({
      success: true,
      income: totalIncome,
      expense: totalExpense,
      netWorth: totalIncome - totalExpense,
      totalTransactions: transactions.length,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Summary calculation failed" });
  }
};

// categorywise transcation

exports.getCategoryBreakdown = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
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

    res.json({
      success: true,
      categories: data,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Category breakdown failed" });
  }
};




// DELETE TRANSACTION

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await transaction.deleteOne();

    res.json({
      success: true,
      message: "Transaction deleted",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};