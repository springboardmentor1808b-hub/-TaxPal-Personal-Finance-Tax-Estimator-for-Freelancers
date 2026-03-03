const mongoose = require("mongoose");

const taxEstimateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    financialYear: {
      type: String, // e.g., "2025-26"
      required: true,
    },

    quarter: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4"],
      required: true,
    },

    totalIncome: {
      type: Number,
      required: true,
    },

    deductions: {
      type: Number,
      default: 0,
    },

    taxableIncome: {
      type: Number,
      required: true,
    },

    totalAnnualTax: {
      type: Number,
      required: true,
    },

    payableTillQuarter: {
      type: Number,
      required: true,
    },

    taxPaid: {
      type: Number,
      default: 0,
    },

    remainingTax: {
      type: Number,
      default: 0,
    },

    interest: {
      type: Number,
      default: 0,
    },

    isSalaried: {
      type: Boolean,
      default: false,
    },

    tds: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaxEstimate", taxEstimateSchema);