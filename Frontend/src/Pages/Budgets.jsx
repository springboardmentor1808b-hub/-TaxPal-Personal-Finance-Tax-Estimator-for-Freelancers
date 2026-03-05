import React from 'react';
import FooterCredit from '../Components/FooterCredit';

const Budgets = () => {
    return (
        <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 h-screen overflow-y-auto z-10 relative flex flex-col">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="header-text text-3xl font-bold text-white">Budgeting Dashboard</h1>
                    <p className="text-slate-400 mt-1 text-sm">Manage your monthly spending limits and track your financial health.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        <span className="text-xs font-medium text-emerald-400 uppercase tracking-wide">Budget Health: Good</span>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">add</span>
                        New Budget
                    </button>
                </div>
            </div>

            {/* Create New Budget Rule */}
            <div className="glass-panel p-6 rounded-2xl mb-8 border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-9xl text-white">account_balance_wallet</span>
                </div>
                <div className="relative z-10">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">edit_square</span>
                        Create New Budget Rule
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-4 space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Category Name</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">category</span>
                                <input className="glass-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-500" placeholder="e.g. Office Supplies" type="text" />
                            </div>
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Budget Limit</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">attach_money</span>
                                <input className="glass-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-500" placeholder="0.00" type="number" />
                            </div>
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Month</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">calendar_month</span>
                                <select className="glass-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white bg-[#131620] appearance-none cursor-pointer">
                                    <option>May 2024</option>
                                    <option>June 2024</option>
                                    <option>July 2024</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-3 text-slate-500 text-sm pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <button className="w-full py-2.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20">
                                Create Rule
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="material-symbols-outlined text-sm">info</span>
                            <span>Optional: Add a description or tags to better organize your spending.</span>
                            <button className="text-blue-400 hover:text-blue-300 ml-2">Add Details</button>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-6 px-1">Active Budgets</h3>
            
            {/* Budgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                
                {/* Budget Card 1 */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-400">laptop_mac</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Software</h4>
                                <p className="text-slate-400 text-xs">Monthly Recurring</p>
                            </div>
                        </div>
                        <button className="text-slate-500 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">more_horiz</span>
                        </button>
                    </div>
                    <div className="space-y-1 mb-4 relative z-10">
                        <div className="flex justify-between items-end">
                            <span className="text-2xl font-bold text-white">$450<span className="text-sm text-slate-500 font-normal"> / $600</span></span>
                            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">75%</span>
                        </div>
                    </div>
                    <div className="relative w-full h-2 bg-slate-700/30 rounded-full overflow-hidden mb-3">
                        <div className="absolute top-0 left-0 h-full w-[75%] bg-blue-500 rounded-full neon-bar shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 border-t border-white/5 pt-3 mt-2">
                        <div>
                            <span className="block text-slate-500 mb-0.5">Spent</span>
                            <span className="text-white font-medium">$450.00</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-slate-500 mb-0.5">Remaining</span>
                            <span className="text-white font-medium">$150.00</span>
                        </div>
                    </div>
                </div>

                {/* Budget Card 2 */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-400">campaign</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Marketing</h4>
                                <p className="text-slate-400 text-xs">Ads &amp; Promo</p>
                            </div>
                        </div>
                        <button className="text-slate-500 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">more_horiz</span>
                        </button>
                    </div>
                    <div className="space-y-1 mb-4 relative z-10">
                        <div className="flex justify-between items-end">
                            <span className="text-2xl font-bold text-white">$1,200<span className="text-sm text-slate-500 font-normal"> / $2,000</span></span>
                            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">60%</span>
                        </div>
                    </div>
                    <div className="relative w-full h-2 bg-slate-700/30 rounded-full overflow-hidden mb-3">
                        <div className="absolute top-0 left-0 h-full w-[60%] bg-purple-500 rounded-full neon-bar shadow-[0_0_10px_rgba(168,85,247,0.6)]"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 border-t border-white/5 pt-3 mt-2">
                        <div>
                            <span className="block text-slate-500 mb-0.5">Spent</span>
                            <span className="text-white font-medium">$1,200.00</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-slate-500 mb-0.5">Remaining</span>
                            <span className="text-white font-medium">$800.00</span>
                        </div>
                    </div>
                </div>

                {/* Budget Card 3 (Over Budget) */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group relative overflow-hidden border border-red-500/20">
                    <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-400">flight</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Travel</h4>
                                <p className="text-slate-400 text-xs">Client Visits</p>
                            </div>
                        </div>
                        <button className="text-slate-500 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">more_horiz</span>
                        </button>
                    </div>
                    <div className="space-y-1 mb-4 relative z-10">
                        <div className="flex justify-between items-end">
                            <span className="text-2xl font-bold text-red-400">$950<span className="text-sm text-slate-500 font-normal"> / $800</span></span>
                            <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">118%</span>
                        </div>
                    </div>
                    <div className="relative w-full h-2 bg-slate-700/30 rounded-full overflow-hidden mb-3">
                        <div className="absolute top-0 left-0 h-full w-[100%] bg-red-500 rounded-full neon-bar shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 border-t border-white/5 pt-3 mt-2">
                        <div>
                            <span className="block text-slate-500 mb-0.5">Spent</span>
                            <span className="text-white font-medium">$950.00</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-slate-500 mb-0.5">Over Budget</span>
                            <span className="text-red-400 font-medium">-$150.00</span>
                        </div>
                    </div>
                </div>

                {/* Budget Card 4 */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-emerald-400">business</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Office Rent</h4>
                                <p className="text-slate-400 text-xs">Co-working Space</p>
                            </div>
                        </div>
                        <button className="text-slate-500 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">more_horiz</span>
                        </button>
                    </div>
                    <div className="space-y-1 mb-4 relative z-10">
                        <div className="flex justify-between items-end">
                            <span className="text-2xl font-bold text-white">$1,500<span className="text-sm text-slate-500 font-normal"> / $1,500</span></span>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">100%</span>
                        </div>
                    </div>
                    <div className="relative w-full h-2 bg-slate-700/30 rounded-full overflow-hidden mb-3">
                        <div className="absolute top-0 left-0 h-full w-[100%] bg-emerald-500 rounded-full neon-bar shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 border-t border-white/5 pt-3 mt-2">
                        <div>
                            <span className="block text-slate-500 mb-0.5">Spent</span>
                            <span className="text-white font-medium">$1,500.00</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-slate-500 mb-0.5">Remaining</span>
                            <span className="text-white font-medium">$0.00</span>
                        </div>
                    </div>
                </div>

                {/* Budget Card 5 */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-amber-400">bolt</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Utilities</h4>
                                <p className="text-slate-400 text-xs">Internet &amp; Power</p>
                            </div>
                        </div>
                        <button className="text-slate-500 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">more_horiz</span>
                        </button>
                    </div>
                    <div className="space-y-1 mb-4 relative z-10">
                        <div className="flex justify-between items-end">
                            <span className="text-2xl font-bold text-white">$120<span className="text-sm text-slate-500 font-normal"> / $300</span></span>
                            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">40%</span>
                        </div>
                    </div>
                    <div className="relative w-full h-2 bg-slate-700/30 rounded-full overflow-hidden mb-3">
                        <div className="absolute top-0 left-0 h-full w-[40%] bg-amber-500 rounded-full neon-bar shadow-[0_0_10px_rgba(245,158,11,0.6)]"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 border-t border-white/5 pt-3 mt-2">
                        <div>
                            <span className="block text-slate-500 mb-0.5">Spent</span>
                            <span className="text-white font-medium">$120.00</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-slate-500 mb-0.5">Remaining</span>
                            <span className="text-white font-medium">$180.00</span>
                        </div>
                    </div>
                </div>

                {/* Add Category Card */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group relative overflow-hidden border-dashed border-2 border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/30 transition-all">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-blue-400 transition-colors">add</span>
                    </div>
                    <h4 className="text-white font-bold text-sm">Add Category</h4>
                    <p className="text-slate-500 text-xs mt-1">Create a new budget limit</p>
                </div>
            </div>

            {/* Budget Alerts & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Budget Alerts */}
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                    <h3 className="text-lg font-bold text-white mb-6">Budget Alerts</h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-4 items-start">
                            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                                <span className="material-symbols-outlined text-lg">warning</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Over Budget: Travel</h4>
                                <p className="text-xs text-slate-400 mt-1">You've exceeded your monthly travel budget by $150. Consider reallocating funds.</p>
                                <button className="mt-2 text-xs font-medium text-red-400 hover:text-red-300">Review Expenses</button>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-4 items-start">
                            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                <span className="material-symbols-outlined text-lg">insights</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Spending Trend</h4>
                                <p className="text-xs text-slate-400 mt-1">Marketing spending is 15% lower than last month. Good job keeping costs down.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Allocation */}
                <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col md:flex-row items-center gap-8 relative">
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Monthly Allocation</h3>
                            <select className="bg-[#131620] text-xs text-slate-400 border border-white/10 rounded-lg px-2 py-1 focus:outline-none hover:text-white cursor-pointer">
                                <option>By Category</option>
                                <option>By Tag</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Necessary Expenses (Rent, Utilities)</span>
                                    <span className="text-white">45%</span>
                                </div>
                                <div className="w-full bg-slate-700/30 rounded-full h-1.5">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full w-[45%]"></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Business Growth (Marketing, Software)</span>
                                    <span className="text-white">35%</span>
                                </div>
                                <div className="w-full bg-slate-700/30 rounded-full h-1.5">
                                    <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-1.5 rounded-full w-[35%]"></div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Budgets;