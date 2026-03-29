const Transaction = require("../models/transaction.model"); 
const TaxEstimate = require("../models/tax.model");

exports.chatAssistant = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user._id;
        const msg = message.toLowerCase();
        
        let reply = "I'm still learning! Try asking about your 'biggest spend', 'how to save tax', or 'advance tax due dates'.";

        // --- 1. USER ASKS ABOUT SPENDING / BIGGEST EXPENSE ---
        if (msg.includes('spend') || msg.includes('expense') || msg.includes('biggest')) {
            const expenses = await Transaction.aggregate([
                { $match: { user: userId, type: 'expense' } },
                { $group: { _id: "$category", total: { $sum: "$amount" } } },
                { $sort: { total: -1 } }, // Sort by highest amount
                { $limit: 1 } // Get the top 1
            ]);

            if (expenses.length > 0) {
                reply = `Your biggest spend is on **${expenses[0]._id}**, totaling **₹${expenses[0].total.toLocaleString('en-IN')}**. Want me to help you set a budget limit for this category?`;
            } else {
                reply = "You don't have any expenses logged yet! Add some transactions first.";
            }
        }
        
        // --- 2. USER ASKS HOW TO SAVE TAX / 80C ---
        else if (msg.includes('save tax') || msg.includes('80c') || msg.includes('invest') || msg.includes('save')) {
            const estimate = await TaxEstimate.findOne({ user: userId }).sort({ createdAt: -1 });
            
            if (estimate) {
                const claimed80C = estimate.lifeInsurance || 0;
                const remaining = 150000 - claimed80C;
                
                if (remaining > 0) {
                    reply = `Based on your saved Tax Profile, you have only claimed ₹${claimed80C.toLocaleString('en-IN')} under Section 80C. You can still invest **₹${remaining.toLocaleString('en-IN')}** (in ELSS, PPF, etc.) before March 31st to maximize your tax savings!`;
                } else {
                    reply = "Excellent job! You have fully exhausted your ₹1.5L limit for Section 80C. Next, consider looking into Section 80D (Medical Insurance) for up to ₹25,000 in additional deductions.";
                }
            } else {
                reply = "I don't have your tax profile yet. Please go to the Tax Estimator page and save an estimate so I can analyze your deductions!";
            }
        }

        // --- 3. USER ASKS ABOUT DUE DATES OR TAX PAYMENTS ---
        else if (msg.includes('tax') || msg.includes('advance') || msg.includes('due') || msg.includes('pay')) {
            const estimate = await TaxEstimate.findOne({ user: userId, financialYear: '2025-26' });
            
            if (estimate) {
                const p = estimate.payments;
                // AI intelligently checks which ones you've already marked as paid!
                if (!p.q1.isPaid) {
                    reply = `Your Q1 Advance Tax of **₹${p.q1.amount.toLocaleString('en-IN')}** is due on June 15th.`;
                } else if (!p.q2.isPaid) {
                    reply = `I see you've already paid Q1! Great job. Your next payment is Q2 (**₹${p.q2.amount.toLocaleString('en-IN')}**), due on September 15th.`;
                } else if (!p.q3.isPaid) {
                    reply = `Q1 and Q2 are paid! Your Q3 Advance Tax of **₹${p.q3.amount.toLocaleString('en-IN')}** is due on December 15th.`;
                } else if (!p.q4.isPaid) {
                    reply = `Almost done for the year. Your Q4 final Advance Tax of **₹${p.q4.amount.toLocaleString('en-IN')}** is due on March 15th.`;
                } else {
                    reply = "Awesome! You have paid all 4 Advance Tax quarters for this financial year. You are 100% compliant.";
                }
            } else {
                reply = "Please run and save a calculation on the Tax Estimator page so I can track your due dates!";
            }
        }
        
        // Basic greetings
        else if (msg.includes('hi') || msg.includes('hello')) {
            reply = `Hello! I have direct access to your financial data. Ask me about your biggest expense or tax obligations!`;
        }

        res.status(200).json({ success: true, reply });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};