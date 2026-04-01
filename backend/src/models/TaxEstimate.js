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
      type: String,
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
      min: 0
    },

    deductions: {
      type: Number,
      default: 0,
      min: 0
    },

    taxableIncome: {
      type: Number,
      required: true,
      min: 0
    },

    totalAnnualTax: {
      type: Number,
      required: true,
      min: 0
    },

    payableTillQuarter: {
      type: Number,
      required: true,
      min: 0
    },

    taxPaid: {
      type: Number,
      default: 0,
      min: 0
    },

    remainingTax: {
      type: Number,
      default: 0,
      min: 0
    },

    interest: {
      type: Number,
      default: 0,
      min: 0
    },

    isSalaried: {
      type: Boolean,
      default: false,
    },

    tds: {
      type: Number,
      default: 0,
      min: 0
    },



    paymentHistory: [{
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      paymentDate: {
        type: Date,
        default: Date.now
      },
      paymentType: {
        type: String,
        enum: ["partial", "full"],
        default: "partial"
      },
      interestIncluded: {
        type: Number,
        default: 0
      },
      remainingAfterPayment: {
        type: Number,
        required: true
      }
    }]

  },
  { timestamps: true }
);

taxEstimateSchema.index(
  { user: 1, financialYear: 1, quarter: 1 },
  { unique: true }
);

module.exports = mongoose.model("TaxEstimate", taxEstimateSchema);