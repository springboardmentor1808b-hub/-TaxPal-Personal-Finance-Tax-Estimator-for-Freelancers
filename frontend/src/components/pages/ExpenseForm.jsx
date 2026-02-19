import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../../api";

const ExpenseForm = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        date: '',
    });

    // Allow only numbers + decimals
    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setFormData({ ...formData, amount: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.amount || !formData.category || !formData.date) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            await API.post("/transactions", {
                ...formData,
                type: "expense",
                amount: Number(formData.amount),
            });

            alert("Expense added successfully!");
            navigate("/dashboard");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#eaeaea] flex items-center justify-center p-6">

            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">

                <div className="h-2 bg-[#ff4d00]"></div>

                <div className="p-10">

                    <h2 className="text-3xl font-bold mb-2 text-gray-800">
                        Add <span className="text-[#ff4d00]">Expense</span>
                    </h2>

                    <p className="text-gray-500 text-sm mb-8">
                        Track where your money goes and stay in control.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Amount (₹)
                            </label>
                            <input
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                required
                                value={formData.amount}
                                onChange={handleAmountChange}
                                className="w-full mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none text-lg focus:border-[#ff4d00] transition"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Expense Category
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none text-lg focus:border-[#ff4d00] transition"
                            >
                                <option value="">Select Category</option>
                                <option value="food">Food / Groceries</option>
                                <option value="household">Household Items</option>
                                <option value="rent">Rent</option>
                                <option value="utilities">Electricity / Water</option>
                                <option value="internet">Internet</option>
                                <option value="travel">Travel</option>
                                <option value="software">Software</option>
                                <option value="marketing">Marketing</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Date Paid
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none text-lg focus:border-[#ff4d00] transition"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className={`w-full mt-4 py-4 rounded-xl text-white font-semibold text-lg transition shadow-md ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#ff4d00] hover:bg-[#e84300] active:scale-95"
                            }`}
                        >
                            {loading ? "Saving..." : "Save Expense Entry"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="w-full text-gray-500 text-sm mt-4 hover:text-[#ff4d00] transition"
                        >
                            ← Back to Dashboard
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ExpenseForm;
