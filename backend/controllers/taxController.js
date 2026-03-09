const TaxEstimate = require('../models/TaxEstimate');

exports.saveTaxEstimate = async (req, res) => {
    try {
        const { 
            country, state, filingStatus, quarter, 
            grossIncome, totalDeductions, taxableIncome, estimatedTax 
        } = req.body;

        const newEstimate = new TaxEstimate({
            user: req.user.id, 
            country,
            state,
            filingStatus,
            quarter,
            grossIncome,
            totalDeductions,
            taxableIncome,
            estimatedTax
        });

        await newEstimate.save();

        res.status(201).json({ message: "Tax estimate saved successfully!", data: newEstimate });

    } catch (error) {
        console.error("Error saving tax:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};