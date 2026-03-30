const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    budgetAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    month: {
      type: String,
      required: true, // Format: "2026-02"
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate budget for same user + category + month
budgetSchema.index(
  { user: 1, category: 1, month: 1 },
  { unique: true }
);

module.exports = mongoose.model("Budget", budgetSchema);