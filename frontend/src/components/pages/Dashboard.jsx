import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ArrowLeftRight,
    Wallet,
    Calculator,
    BarChart3,
    LogOut,
    TrendingUp,
    TrendingDown,
    CircleDollarSign,
    ChevronUp
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

   
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const [user] = useState(storedUser || {
        firstName: 'User',
        lastName: '',
        email: ''
    });

    const [summary] = useState({
        income: 420.00,
        expenses: 0.00,
        taxDue: 0.00,
        savingsRate: 100
    });

    const transactions = [
        { id: 1, date: 'May 8, 2025', desc: 'Design Project', cat: 'Consulting', amount: '+ $120.00', type: 'income' }
    ];

    return (
        <div className="flex min-h-screen bg-[#fafafa] font-sans text-slate-700">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-[#1a1a1a] flex flex-col fixed h-full shadow-2xl">
                <div className="p-8">
                    <h1 className="text-3xl font-black italic tracking-tighter text-white">
                        Tax<span className="text-[#ff4d00]">Pal</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 mt-4 space-y-2">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                    <NavItem icon={<ArrowLeftRight size={20} />} label="Transactions" />
                    <NavItem icon={<Wallet size={20} />} label="Budgets" />
                    <NavItem icon={<Calculator size={20} />} label="Tax Estimator" />
                    <NavItem icon={<BarChart3 size={20} />} label="Reports" />
                </nav>

                {/* Sidebar User Profile */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex items-center gap-3 p-2 mb-4 text-white">
                        <div className="w-10 h-10 bg-[#ff4d00] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {user.firstName?.charAt(0)}
                            {user.lastName?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* ✅ UPDATED LOGOUT */}
                    <button
                        onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#ff4d00] w-full px-2 py-2 rounded-lg transition-all font-semibold"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 ml-64 p-10">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-[#1a1a1a] tracking-tight">
                            Overview
                        </h2>
                        <p className="text-gray-500 font-medium">
                            Track your earnings and potential tax savings.
                        </p>
                    </div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        May 2025
                    </div>
                </header>
                
                <div className="flex gap-4 mb-10">
                    <button
                        onClick={() => navigate("/income")}
                        className="bg-emerald-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow hover:bg-emerald-600 transition active:scale-95"
                    >
                        + Add Income
                    </button>

                    <button
                        onClick={() => navigate("/expense")}
                        className="bg-rose-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow hover:bg-rose-600 transition active:scale-95"
                    >
                        + Add Expense
                    </button>
                </div>


                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatCard label="Monthly Income" value={`$${summary.income}`} trend="↑ 12%" color="text-emerald-500" icon={<TrendingUp />} />
                    <StatCard label="Monthly Expenses" value={`$${summary.expenses}`} trend="↓ 8%" color="text-rose-500" icon={<TrendingDown />} />
                    <StatCard label="Estimated Tax Due" value={`$${summary.taxDue}`} trend="On track" color="text-amber-500" icon={<CircleDollarSign />} />

                    <div className="bg-[#1a1a1a] p-6 rounded-[2rem] shadow-xl text-white border-b-4 border-[#ff4d00]">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Savings Rate
                        </p>
                        <h4 className="text-3xl font-black text-[#ff4d00] mb-1">
                            {summary.savingsRate}%
                        </h4>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter flex items-center gap-1">
                            <ChevronUp size={12} /> 3.2% from goal
                        </p>
                    </div>
                </div>

                {/* Transactions & Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-black text-xl text-[#1a1a1a]">
                                Recent Transactions
                            </h3>
                            <button className="bg-[#ff4d00]/10 text-[#ff4d00] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#ff4d00] hover:text-white transition-all">
                                View All
                            </button>
                        </div>
                        <div className="p-4">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] uppercase text-gray-400 font-black tracking-widest border-b border-gray-50">
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-semibold">
                                    {transactions.map(t => (
                                        <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-5 text-gray-400">{t.date}</td>
                                            <td className="px-6 py-5 text-[#1a1a1a]">{t.desc}</td>
                                            <td className="px-6 py-5">
                                                <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] uppercase text-gray-500">
                                                    {t.cat}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right font-black text-emerald-500">
                                                {t.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                        <h3 className="font-black text-xl text-[#1a1a1a] mb-8 w-full text-left">
                            Expense Breakdown
                        </h3>
                        <div className="relative w-40 h-40 mb-8">
                            <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
                                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#ff4d00" strokeWidth="32" strokeDasharray="100 100" />
                                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#1a1a1a" strokeWidth="32" strokeDasharray="30 100" />
                                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#e2e8f0" strokeWidth="32" strokeDasharray="15 100" strokeDashoffset="-30" />
                            </svg>
                        </div>
                        <div className="w-full space-y-3">
                            <LegendItem color="bg-[#ff4d00]" label="Main Expenses" pct="65%" />
                            <LegendItem color="bg-[#1a1a1a]" label="Tax Savings" pct="25%" />
                            <LegendItem color="bg-gray-200" label="Other" pct="10%" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
const NavItem = ({ icon, label, active = false }) => (
    <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all ${
        active
            ? 'bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/30 font-bold scale-105'
            : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
    }`}>
        {icon}
        <span className="text-sm tracking-wide">{label}</span>
    </div>
);

const StatCard = ({ label, value, trend, icon, color }) => (
    <div className="bg-white p-7 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gray-50 rounded-2xl text-[#1a1a1a]">
                {icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${color}`}>
                {trend}
            </span>
        </div>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            {label}
        </p>

        <h4 className="text-3xl font-black text-[#1a1a1a]">
            {value}
        </h4>
    </div>
);

const LegendItem = ({ color, label, pct }) => (
    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="text-xs font-bold text-gray-600">{label}</span>
        </div>

        <span className="text-xs font-black text-[#1a1a1a]">
            {pct}
        </span>
    </div>
);

export default Dashboard;
