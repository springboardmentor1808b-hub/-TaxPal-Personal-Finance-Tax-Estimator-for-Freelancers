import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../../api";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState({ income: 0, expense: 0, tax: 0 });

    useEffect(() => {
        // LocalStorage se user ki details nikalna
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login'); // Agar login nahi hai toh wapas bhejo
        } else {
            setUser(storedUser);
            // Yahan hum future mein backend se total income/expense fetch karenge
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-[#eee] px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-2xl font-black italic text-[#1a1a1a]">
                    Tax<span className="text-[#ff4d00]">Pal</span>
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 hidden md:block">
                        Welcome, {user?.firstName || 'User'}
                    </span>
                    <button 
                        onClick={handleLogout}
                        className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-6">
                {/* Greeting */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#1a1a1a]">Overview</h2>
                    <p className="text-gray-500">Track your earnings and potential tax savings.</p>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#eee]">
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Income</p>
                        <h3 className="text-3xl font-black text-green-600 mt-1">₹{summary.income.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#eee]">
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Expenses</p>
                        <h3 className="text-3xl font-black text-red-500 mt-1">₹{summary.expense.toLocaleString()}</h3>
                    </div>
                    <div className="bg-[#1a1a1a] p-6 rounded-[2rem] shadow-lg text-white">
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Est. Tax Liability</p>
                        <h3 className="text-3xl font-black text-[#ff4d00] mt-1">₹{summary.tax.toLocaleString()}</h3>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <button 
                        onClick={() => navigate('/add-income')}
                        className="flex-1 bg-white border-2 border-green-500 text-green-600 font-bold p-5 rounded-2xl hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="text-2xl">+</span> Add Income
                    </button>
                    <button 
                        onClick={() => navigate('/add-expense')}
                        className="flex-1 bg-white border-2 border-red-500 text-red-500 font-bold p-5 rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="text-2xl">−</span> Add Expense
                    </button>
                </div>

                {/* Recent Activity Placeholder */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-[#eee] overflow-hidden">
                    <div className="p-6 border-b border-[#eee] flex justify-between items-center">
                        <h3 className="font-bold text-lg">Recent Transactions</h3>
                        <button className="text-[#ff4d00] text-sm font-bold">View All</button>
                    </div>
                    <div className="p-10 text-center">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-gray-400">📊</span>
                        </div>
                        <p className="text-gray-400">No transactions logged yet.</p>
                        <p className="text-sm text-gray-300">Start by adding your first income or expense.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;