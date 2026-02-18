import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../../api";

const IncomeForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        date: '',
    });

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setFormData({ ...formData, amount: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await API.post("/transactions", {
                ...formData,
                type: "income",
                amount: Number(formData.amount)
            });

            alert("Income added successfully!");
            navigate("/dashboard");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add income");
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
                        Add <span className="text-[#ff4d00]">Income</span>
                    </h2>
                    <p className="text-gray-500 text-sm mb-8">
                        Track your earnings easily and stay organized.
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
                                className="w-full mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none text-lg
                                focus:border-[#ff4d00] transition"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Income Category
                            </label>
                            <select
                                required
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none text-lg
                                focus:border-[#ff4d00] transition"
                            >
                                <option value="">Select Category</option>
                                <option value="Salary">Salary</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Investment">Investment</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Date Received
                            </label>
                            <input
                                type="date"
                                required
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none text-lg
                                focus:border-[#ff4d00] transition"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className={`w-full mt-4 py-4 rounded-xl text-white font-semibold text-lg transition shadow-md
                            ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#ff4d00] hover:bg-[#e84300] active:scale-95"
                            }`}
                        >
                            {loading ? "Saving..." : "Save Income Entry"}
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

export default IncomeForm;