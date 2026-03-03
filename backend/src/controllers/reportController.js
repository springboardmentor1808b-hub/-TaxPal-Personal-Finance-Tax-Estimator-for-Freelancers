const Transaction = require("../models/Transaction");
const TaxEstimate = require("../models/TaxEstimate");
const Report = require("../models/Report");
const { Parser } = require("json2csv");
/*
================================================
INCOME REPORT
GET /api/reports/income?month=5&year=2025
================================================
*/

exports.getIncomeReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const transactions = await Transaction.find({
      user: req.user.id,
      type: "income",
      date: { $gte: start, $lt: end },
    });

    const totalIncome = transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    res.json({
      success: true,
      month,
      year,
      totalIncome,
      transactions,
    });

  } catch (error) {
    res.status(500).json({ message: "Income report failed" });
  }
};
/*
================================================
EXPENSE REPORT
GET /api/reports/expense?month=5&year=2025
================================================
*/

exports.getExpenseReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const transactions = await Transaction.find({
      user: req.user.id,
      type: "expense",
      date: { $gte: start, $lt: end },
    });

    const totalExpense = transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    res.json({
      success: true,
      month,
      year,
      totalExpense,
      transactions,
    });

  } catch (error) {
    res.status(500).json({ message: "Expense report failed" });
  }
};

/*
================================================
INCOME VS EXPENSE
GET /api/reports/income-expense?year=2025
================================================
*/

exports.getIncomeExpenseReport = async (req, res) => {
  try {
    const { year } = req.query;

    const start = new Date(year, 0, 1);
    const end = new Date(Number(year) + 1, 0, 1);

    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: start, $lt: end },
    });

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    res.json({
      success: true,
      year,
      income,
      expense,
      profit: income - expense,
    });

  } catch (error) {
    res.status(500).json({ message: "Income vs Expense report failed" });
  }
};
/*
================================================
TAX REPORT
GET /api/reports/tax?financialYear=2025-26
================================================
*/

exports.getTaxReport = async (req, res) => {
  try {
    const { financialYear } = req.query;

    const records = await TaxEstimate.find({
      user: req.user.id,
      financialYear,
    });

    const totalTax = records.reduce(
      (sum, r) => sum + r.totalAnnualTax,
      0
    );

    const totalPaid = records.reduce(
      (sum, r) => sum + r.taxPaid,
      0
    );

    res.json({
      success: true,
      financialYear,
      totalTax,
      totalPaid,
      remaining: totalTax - totalPaid,
      quarters: records,
    });

  } catch (error) {
    res.status(500).json({ message: "Tax report failed" });
  }
};

/*
================================================
EXPORT INCOME REPORT CSV
GET /api/reports/income/csv?month=5&year=2025
================================================
*/

exports.exportIncomeCSV = async (req, res) => {
  try {
    const { month, year } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const transactions = await Transaction.find({
      user: req.user.id,
      type: "income",
      date: { $gte: start, $lt: end },
    });

    const fields = ["date", "category", "amount", "description"];
    const parser = new Parser({ fields });

    const csv = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment(`income-${month}-${year}.csv`);
    return res.send(csv);

  } catch (error) {
    res.status(500).json({ message: "CSV export failed" });
  }
};

exports.exportExpenseCSV = async (req, res) => {
  try {
    const { month, year } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const transactions = await Transaction.find({
      user: req.user.id,
      type: "expense",
      date: { $gte: start, $lt: end },
    });

    const fields = ["date", "category", "amount", "description"];
    const parser = new Parser({ fields });

    const csv = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment(`expense-${month}-${year}.csv`);
    return res.send(csv);

  } catch (error) {
    res.status(500).json({ message: "CSV export failed" });
  }
};
exports.exportTaxCSV = async (req, res) => {
  try {
    const { financialYear } = req.query;

    const records = await TaxEstimate.find({
      user: req.user.id,
      financialYear,
    });

    const fields = [
      "quarter",
      "totalIncome",
      "deductions",
      "taxableIncome",
      "totalAnnualTax",
      "payableTillQuarter",
      "taxPaid",
      "remainingTax",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(records);

    res.header("Content-Type", "text/csv");
    res.attachment(`tax-${financialYear}.csv`);
    return res.send(csv);

  } catch (error) {
    res.status(500).json({ message: "Tax CSV export failed" });
  }
};