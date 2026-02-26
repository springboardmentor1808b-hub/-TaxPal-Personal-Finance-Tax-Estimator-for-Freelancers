import React from 'react';
import { useOutletContext } from 'react-router-dom';
import FooterCredit from '../Components/FooterCredit';

const Dashboard = () => {
    // We magically get the 'user' object from our new DashboardLayout!
    const { user } = useOutletContext();

    return (
        <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 h-screen overflow-y-auto z-10 relative flex flex-col">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="header-text text-3xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-slate-400 mt-1 text-sm">Welcome back, {user.name}. Here's your financial snapshot.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg glass-panel text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export Report
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add Transaction
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card 1 */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <span className="material-symbols-outlined text-blue-400">arrow_upward</span>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">trending_up</span> 12%
                        </span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-400">Monthly Income</p>
                        <h3 className="text-2xl font-bold text-white">$8,240.50</h3>
                    </div>
                    <div className="mt-4 h-1 w-full bg-slate-700/30 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[75%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <span className="material-symbols-outlined text-purple-400">arrow_downward</span>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">trending_up</span> 4.3%
                        </span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-400">Monthly Expenses</p>
                        <h3 className="text-2xl font-bold text-white">$3,892.20</h3>
                    </div>
                    <div className="mt-4 h-1 w-full bg-slate-700/30 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <span className="material-symbols-outlined text-orange-400">account_balance</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">Due: Apr 15</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-400">Estimated Tax Due</p>
                        <h3 className="text-2xl font-bold text-white">$1,245.00</h3>
                    </div>
                    <div className="mt-4 h-1 w-full bg-slate-700/30 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[30%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <span className="material-symbols-outlined text-emerald-400">savings</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-400">Savings Rate</p>
                        <h3 className="text-2xl font-bold text-white">28.5%</h3>
                    </div>
                    <div className="mt-4 h-8 flex items-end gap-1">
                        <div className="w-1 bg-emerald-500/30 h-[40%] rounded-t-sm"></div>
                        <div className="w-1 bg-emerald-500/40 h-[60%] rounded-t-sm"></div>
                        <div className="w-1 bg-emerald-500/60 h-[50%] rounded-t-sm"></div>
                        <div className="w-1 bg-emerald-500/50 h-[70%] rounded-t-sm"></div>
                        <div className="w-1 bg-emerald-500 h-[85%] rounded-t-sm shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <div className="w-1 bg-emerald-500/40 h-[65%] rounded-t-sm"></div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Cash Flow Chart Mockup */}
                <div className="glass-panel p-6 rounded-2xl lg:col-span-2 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-white">Cash Flow</h3>
                        <div className="flex gap-2 text-xs">
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-slate-400">Income</span></div>
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="text-slate-400">Expenses</span></div>
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        {/* Bars - Mock Data */}
                        {[60, 75, 45, 85, 65, 90].map((h, i) => (
                            <div key={i} className="flex-1 flex gap-1 h-full items-end group">
                                <div className={`w-full bg-blue-500/80 rounded-t-sm relative transition-all group-hover:bg-blue-400`} style={{ height: `${h}%` }}></div>
                                <div className={`w-full bg-purple-500/80 rounded-t-sm relative transition-all group-hover:bg-purple-400`} style={{ height: `${h * 0.6}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500 px-4">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                </div>

                {/* Expenses Donut Chart */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative">
                    <div className="w-full flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Expenses</h3>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-sm">more_horiz</span>
                        </button>
                    </div>
                    <div className="donut-chart mb-8 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                        <div className="donut-hole">
                            <span className="text-2xl font-bold text-white">$3.8k</span>
                            <span className="text-xs text-slate-400">Total</span>
                        </div>
                    </div>
                    <div className="w-full space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-slate-300">Software</span></div>
                            <span className="text-white font-medium">35%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-slate-300">Rent/Office</span></div>
                            <span className="text-white font-medium">25%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-panel rounded-2xl overflow-hidden mb-6">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                    <a className="text-sm text-blue-400 hover:text-blue-300 font-medium cursor-pointer">View All</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider">
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300 divide-y divide-white/5">
                            <tr className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <span className="material-symbols-outlined text-sm">design_services</span>
                                    </div>
                                    <span className="font-medium text-white">Figma Subscription</span>
                                </td>
                                <td className="p-4"><span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400 border border-slate-700">Software</span></td>
                                <td className="p-4 text-slate-400">Oct 24, 2023</td>
                                <td className="p-4"><span className="text-red-400">Expense</span></td>
                                <td className="p-4 text-right font-medium text-white">-$15.00</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <span className="material-symbols-outlined text-sm">payments</span>
                                    </div>
                                    <span className="font-medium text-white">Client Payment</span>
                                </td>
                                <td className="p-4"><span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400 border border-slate-700">Income</span></td>
                                <td className="p-4 text-slate-400">Oct 22, 2023</td>
                                <td className="p-4"><span className="text-emerald-400">Income</span></td>
                                <td className="p-4 text-right font-medium text-emerald-400">+$2,450.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- GLOBAL FOOTER --- */}
            <div className="border-t border-white/5 mt-auto">
                <FooterCredit />
            </div>

        </main>
    );
};

export default Dashboard;