const TaxEstimate = require('../models/TaxEstimate');

exports.saveTaxEstimate = async (req, res) => {
    try {
        const {
            country, state, filingStatus, year,
            grossIncome, totalDeductions, taxableIncome, estimatedTax,
            quarter, paidAmount,
        } = req.body;

        if (country === undefined || country === null || 
            year === undefined || year === null || 
            grossIncome === undefined || grossIncome === null || 
            totalDeductions === undefined || totalDeductions === null || 
            taxableIncome === undefined || taxableIncome === null || 
            estimatedTax === undefined || estimatedTax === null) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newEstimate = new TaxEstimate({
            user: req.user.id,
            country,
            state,
            filingStatus,
            year,
            quarter,
            grossIncome,
            totalDeductions,
            taxableIncome,
            estimatedTax,
            paidAmount: paidAmount || 0,
        });

        await newEstimate.save();

        res.status(201).json({ message: "Tax estimate saved successfully!", data: newEstimate });

    } catch (error) {
        console.error("Error saving tax:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getTaxEstimates = async (req, res) => {
    try {
        const estimates = await TaxEstimate.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ data: estimates });
    } catch (error) {
        console.error("Error fetching tax estimates:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.addTaxPayment = async (req, res) => {
    try {
        const { quarter, amount, year, country, state, filingStatus } = req.body;
        if (quarter === undefined || quarter === null || 
            amount === undefined || amount === null || 
            year === undefined || year === null ||
            country === undefined || country === null) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Save a minority record to tax estimates for tracking/payments
        const paymentEntry = new TaxEstimate({
            user: req.user.id,
            country,
            state: state || "",
            filingStatus: filingStatus || "",
            year,
            quarter,
            grossIncome: 0,
            totalDeductions: 0,
            taxableIncome: 0,
            estimatedTax: 0,
            paidAmount: amount,
        });
        await paymentEntry.save();

        res.json({ message: "Tax payment recorded", payment: paymentEntry });
    } catch (error) {
        console.error("Error recording tax payment:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
