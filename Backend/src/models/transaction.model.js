const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    type: {
        type: String,
        enum:["income", "expense"],
        required:[true, "Type is required (income or expense)"]
    },
    amount: {
        type: Number,
        required:[true, "Amount is required"]
    },
    category: {
        type: String,
        required:[true, "Category is required"]
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);