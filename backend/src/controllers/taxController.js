const TaxEstimate = require("../models/TaxEstimate");

/*
====================================================
PROGRESSIVE TAX CALCULATION (Exact Slab Logic)
====================================================
*/

const calculateProgressiveTax = (income) => {
  let tax = 0;

  if (income <= 250000) return 0;

  // 2.5L – 5L → 5%
  if (income > 250000) {
    const slab = Math.min(income, 500000) - 250000;
    tax += slab * 0.05;
  }

  // 5L – 10L → 10%
  if (income > 500000) {
    const slab = Math.min(income, 1000000) - 500000;
    tax += slab * 0.10;
  }

  // 10L – 20L → 15%
  if (income > 1000000) {
    const slab = Math.min(income, 2000000) - 1000000;
    tax += slab * 0.15;
  }

  // Above 20L → 20%
  if (income > 2000000) {
    const slab = income - 2000000;
    tax += slab * 0.20;
  }

  return tax;
};

/*
====================================================
COMPOUND 1% MONTHLY INTEREST
====================================================
*/

const calculateCompoundInterest = (amount, months) => {
  let total = amount;

  for (let i = 0; i < months; i++) {
    total += total * 0.01;
  }

  return total - amount;
};

/*
====================================================
CALCULATE TAX (Main API)
POST /api/tax/calculate
====================================================
*/

exports.calculateTax = async (req, res) => {
  try {
    const {
      totalIncome,
      totalDeductions = 0,
      isSalaried = false,
      tds = 0,
      quarter,
      financialYear,
      saveEstimate = false,
    } = req.body;

    if (!totalIncome || !quarter || !financialYear) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // 1️⃣ Deduction before tax
    const taxableIncome = totalIncome - totalDeductions;

    // 2️⃣ Progressive slab calculation
    let totalAnnualTax = calculateProgressiveTax(taxableIncome);

    // 3️⃣ TDS subtraction (only if salaried)
    if (isSalaried) {
      totalAnnualTax = Math.max(totalAnnualTax - tds, 0);
    }

    // 4️⃣ Quarterly installment logic
    const quarterPercent = {
      Q1: 0.15,
      Q2: 0.45,
      Q3: 0.75,
      Q4: 1.0,
    };

    const payableTillQuarter = totalAnnualTax * quarterPercent[quarter];

    let response = {
      totalIncome,
      totalDeductions,
      taxableIncome,
      totalAnnualTax,
      payableTillQuarter,
    };

    // 5️⃣ Save if requested
    if (saveEstimate) {
      const taxDoc = await TaxEstimate.create({
        user: req.user.id,
        financialYear,
        quarter,
        totalIncome,
        deductions: totalDeductions,
        taxableIncome,
        totalAnnualTax,
        payableTillQuarter,
        taxPaid: 0,
        remainingTax: payableTillQuarter,
        isSalaried,
        tds,
      });

      response.saved = true;
      response.recordId = taxDoc._id;
    }

    res.json({ success: true, data: response });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Tax calculation failed" });
  }
};

/*
====================================================
PAY TAX INSTALLMENT (Auto Interest Calculation)
POST /api/tax/pay/:id
====================================================
*/

exports.payTax = async (req, res) => {
  try {
    const { amountPaid } = req.body;

    const taxRecord = await TaxEstimate.findById(req.params.id);

    if (!taxRecord)
      return res.status(404).json({ message: "Record not found" });

    if (taxRecord.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    // Calculate due date
    const dueDates = {
      Q1: "06-15",
      Q2: "09-15",
      Q3: "12-15",
      Q4: "03-15",
    };

    const [startYear] = taxRecord.financialYear.split("-");
    let dueYear = startYear;

    if (taxRecord.quarter === "Q4") {
      dueYear = Number(startYear) + 1;
    }

    const dueDate = new Date(`${dueYear}-${dueDates[taxRecord.quarter]}`);

    const today = new Date();

    let remaining = taxRecord.remainingTax;
    let monthsLate = 0;
    let interest = 0;

    if (today > dueDate && remaining > 0) {
      const diffTime = today - dueDate;
      monthsLate = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));

      if (monthsLate > 0) {
        interest = calculateCompoundInterest(remaining, monthsLate);
        remaining += interest;
      }
    }

    // Apply payment
    remaining -= amountPaid;

    taxRecord.taxPaid += amountPaid;
    taxRecord.remainingTax = remaining > 0 ? remaining : 0;

    await taxRecord.save();

    res.json({
      success: true,
      monthsLate,
      interestAdded: interest,
      remainingTax: taxRecord.remainingTax,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment failed" });
  }
};

/*
====================================================
DYNAMIC TAX REMINDERS (Calendar View)
GET /api/tax/reminders?financialYear=2025-26
====================================================
*/

exports.getTaxReminders = async (req, res) => {
  try {
    const { financialYear } = req.query;

    if (!financialYear) {
      return res.status(400).json({ message: "Financial year required" });
    }

    const records = await TaxEstimate.find({
      user: req.user.id,
      financialYear,
    });

    const dueDates = {
      Q1: "06-15",
      Q2: "09-15",
      Q3: "12-15",
      Q4: "03-15",
    };

    const today = new Date();
    const reminders = [];

    for (let record of records) {

      const [startYear] = financialYear.split("-");
      let dueYear = startYear;

      if (record.quarter === "Q4") {
        dueYear = Number(startYear) + 1;
      }

      const dueDate = new Date(`${dueYear}-${dueDates[record.quarter]}`);

      let remaining = record.remainingTax;
      let monthsLate = 0;
      let interest = 0;
      let totalPayableToday = remaining;

      if (today > dueDate && remaining > 0) {
        const diffTime = today - dueDate;
        monthsLate = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));

        if (monthsLate > 0) {
          interest = calculateCompoundInterest(remaining, monthsLate);
          totalPayableToday = remaining + interest;
        }
      }

      reminders.push({
        quarter: record.quarter,
        dueDate,
        totalAnnualTax: record.totalAnnualTax,
        payableTillQuarter: record.payableTillQuarter,
        taxPaid: record.taxPaid,
        remaining,
        monthsLate,
        interestIfPaidToday: interest,
        totalPayableToday,
        status:
          remaining <= 0
            ? "Paid"
            : today > dueDate
            ? "Overdue"
            : "Upcoming",
      });
    }

    res.json({ success: true, reminders });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Reminder fetch failed" });
  }
};