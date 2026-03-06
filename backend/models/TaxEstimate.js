const mongoose = require('mongoose');

const TaxEstimateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    country: { type: String, required: true },
    state: { type: String },
    filingStatus: { type: String },
    quarter: { type: String, required: true },
    grossIncome: { type: Number, required: true },
    totalDeductions: { type: Number, required: true },
    
    taxableIncome: { type: Number, required: true },
    estimatedTax: { type: Number, required: true },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaxEstimate', TaxEstimateSchema);