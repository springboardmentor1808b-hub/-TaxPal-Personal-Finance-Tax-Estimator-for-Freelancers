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
SIMPLE INTEREST CALCULATION (1% per month as per Indian Tax Law)
====================================================
*/

const calculateSimpleInterest = (amount, daysLate) => {
  // Indian tax law: 1% per month simple interest
  // Calculate based on actual days, not approximated months
  const monthlyRate = 0.01; // 1% per month
  const dailyRate = monthlyRate / 30; // Daily rate approximation
  
  return amount * dailyRate * daysLate;
};

/*
====================================================
CALCULATE TAX (Estimator / Save Optional)
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

    // Deduction before tax
    const taxableIncome = totalIncome - totalDeductions;

    // Progressive slab tax
    let totalAnnualTax = calculateProgressiveTax(taxableIncome);

    // TDS subtraction (salaried)
    if (isSalaried) {
      totalAnnualTax = Math.max(totalAnnualTax - tds, 0);
    }

    // Quarterly percentages
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

    /*
    ===============================
    SAVE RECORD (Optional)
    ===============================
    */

    if (saveEstimate) {

      const existingRecord = await TaxEstimate.findOne({
        user: req.user.id,
        financialYear,
        quarter
      });

      if (existingRecord) {
        return res.status(409).json({
          message:
            "Tax estimate already exists for this financial year and quarter. Use replace API if you want to update it."
        });
      }

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
        tds
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
REPLACE EXISTING TAX ESTIMATE
PUT /api/tax/replace
====================================================
*/

exports.replaceTaxEstimate = async (req, res) => {
  try {

    const {
      financialYear,
      quarter,
      totalIncome,
      totalDeductions,
      taxableIncome,
      totalAnnualTax,
      payableTillQuarter,
      isSalaried,
      tds
    } = req.body;

    const updated = await TaxEstimate.findOneAndUpdate(
      {
        user: req.user.id,
        financialYear,
        quarter
      },
      {
        totalIncome,
        deductions: totalDeductions,
        taxableIncome,
        totalAnnualTax,
        payableTillQuarter,
        isSalaried,
        tds,
        remainingTax: payableTillQuarter
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Tax estimate replaced successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ message: "Replace failed" });
  }
};

/*
====================================================
PAY TAX INSTALLMENT
POST /api/tax/pay/:id
====================================================
*/

exports.payTax = async (req, res) => {
  try {

    const { amountPaid } = req.body;

    if (!amountPaid) {
      return res.status(400).json({
        message: "amountPaid is required"
      });
    }

    const taxRecord = await TaxEstimate.findById(req.params.id);

    if (!taxRecord)
      return res.status(404).json({ message: "Record not found" });

    if (taxRecord.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

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
    let daysLate = 0;
    let interest = 0;

    if (today > dueDate && remaining > 0) {

      const diffTime = today - dueDate;
      daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Actual days late

      if (daysLate > 0) {
        interest = calculateSimpleInterest(remaining, daysLate);
        remaining += interest;
      }
    }

    remaining -= amountPaid;

    taxRecord.taxPaid += amountPaid;
    taxRecord.remainingTax = remaining > 0 ? remaining : 0;
    taxRecord.interest += interest;

    // Add payment history entry
    taxRecord.paymentHistory.push({
      amount: amountPaid,
      paymentDate: new Date(),
      paymentType: remaining <= 0 ? "full" : "partial",
      interestIncluded: interest,
      remainingAfterPayment: taxRecord.remainingTax
    });

    await taxRecord.save();

    res.json({
      success: true,
      amountPaid,
      daysLate,
      interestAdded: interest,
      remainingTax: taxRecord.remainingTax
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment failed" });
  }
};

/*
====================================================
TAX REMINDERS (Dashboard Calendar)
GET /api/tax/reminders?financialYear=2025-26
====================================================
*/

exports.getTaxReminders = async (req, res) => {
  try {

    const { financialYear } = req.query;

    const records = await TaxEstimate.find({
      user: req.user.id,
      financialYear
    });

    const dueDates = {
      Q1: "06-15",
      Q2: "09-15",
      Q3: "12-15",
      Q4: "03-15"
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
      let daysLate = 0;
      let interest = 0;

      if (today > dueDate && remaining > 0) {

        const diffTime = today - dueDate;
        daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Actual days late

        if (daysLate > 0) {
          interest = calculateSimpleInterest(remaining, daysLate);
        }
      }

      reminders.push({
        _id: record._id,
        quarter: record.quarter,
        dueDate,
        totalAnnualTax: record.totalAnnualTax,
        payableTillQuarter: record.payableTillQuarter,
        taxPaid: record.taxPaid,
        remaining,
        daysLate,
        interestIfPaidToday: interest,
        totalPayableToday: remaining + interest,
        paymentHistory: record.paymentHistory || [],
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
    res.status(500).json({ message: "Reminder fetch failed" });
  }
};