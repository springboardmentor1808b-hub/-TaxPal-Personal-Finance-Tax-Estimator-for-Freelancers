const mongoose = require('mongoose');

const TaxEstimateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    country: { type: String, required: true },
    state: { type: String },
    filingStatus: { type: String },
    year: { type: Number, required: true },
    // Optional specificity for one quarter payment records
    quarter: { type: String },
    grossIncome: { type: Number, required: true },
    totalDeductions: { type: Number, required: true },
    
    taxableIncome: { type: Number, required: true },
    estimatedTax: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaxEstimate', TaxEstimateSchema);