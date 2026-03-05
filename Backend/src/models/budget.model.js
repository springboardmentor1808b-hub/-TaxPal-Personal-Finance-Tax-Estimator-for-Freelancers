const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    category: {
        type: String,
        required:[true, "Category is required"]
    },
    limit: {
        type: Number,
        required: [true, "Budget limit is required"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Budget", budgetSchema);