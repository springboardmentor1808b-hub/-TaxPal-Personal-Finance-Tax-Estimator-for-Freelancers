const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    period: {
      type: String, // e.g. "Jan-2025" or "Q1-2025-26"
      required: true,
    },

    reportType: {
      type: String,
      enum: ["income", "expense", "income-expense", "tax"],
      required: true,
    },

    filePath: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);