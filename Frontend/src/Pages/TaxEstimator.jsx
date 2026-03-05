import React from 'react';
import FooterCredit from '../Components/FooterCredit';

const TaxEstimator = () => {
    return (
        <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 h-screen overflow-y-auto z-10 relative flex flex-col">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="header-text text-3xl font-bold text-white">Tax Estimator & Calendar</h1>
                    <p className="text-slate-400 mt-1 text-sm">Calculate your quarterly obligations and stay on top of deadlines.</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                
                {/* Left Column: Calculator & Calendar */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Quarterly Tax Calculator */}
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400">calculate</span>
                                Quarterly Tax Calculator
                            </h3>
                        </div>
                        
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Country/Region</label>
                                    <div className="relative">
                                        <select className="w-full rounded-lg input-glass py-3 px-4 text-sm appearance-none cursor-pointer">
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>United Kingdom</option>
                                            <option>Australia</option>
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <span className="material-symbols-outlined text-lg">expand_more</span>
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">State/Province</label>
                                    <div className="relative">
                                        <select className="w-full rounded-lg input-glass py-3 px-4 text-sm appearance-none cursor-pointer">
                                            <option>California</option>
                                            <option>New York</option>
                                            <option>Texas</option>
                                            <option>Florida</option>
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <span className="material-symbols-outlined text-lg">expand_more</span>
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Filing Status</label>
                                    <div className="relative">
                                        <select className="w-full rounded-lg input-glass py-3 px-4 text-sm appearance-none cursor-pointer">
                                            <option>Single</option>
                                            <option>Married Filing Jointly</option>
                                            <option>Head of Household</option>
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <span className="material-symbols-outlined text-lg">expand_more</span>
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Quarter</label>
                                    <div className="relative">
                                        <select className="w-full rounded-lg input-glass py-3 px-4 text-sm appearance-none cursor-pointer">
                                            <option>Q2 (Apr-Jun 2025)</option>
                                            <option>Q3 (Jul-Sep 2025)</option>
                                            <option>Q4 (Oct-Dec 2025)</option>
                                            <option>Q1 (Jan-Mar 2026)</option>
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <span className="material-symbols-outlined text-lg">expand_more</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="border-white/5 my-2" />
                            
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-white">Income &amp; Deductions</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400">Gross Income for Quarter</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                            <input className="w-full rounded-lg input-glass py-3 pl-8 pr-4 text-sm placeholder-slate-600" placeholder="0.00" type="text" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400">Business Expenses</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                            <input className="w-full rounded-lg input-glass py-3 pl-8 pr-4 text-sm placeholder-slate-600" placeholder="0.00" type="text" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400">Health Insurance Premiums</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                            <input className="w-full rounded-lg input-glass py-3 pl-8 pr-4 text-sm placeholder-slate-600" placeholder="0.00" type="text" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400">Home Office Deduction</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                            <input className="w-full rounded-lg input-glass py-3 pl-8 pr-4 text-sm placeholder-slate-600" placeholder="0.00" type="text" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400">Retirement Contributions</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                            <input className="w-full rounded-lg input-glass py-3 pl-8 pr-4 text-sm placeholder-slate-600" placeholder="0.00" type="text" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400">Other Deductions</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                            <input className="w-full rounded-lg input-glass py-3 pl-8 pr-4 text-sm placeholder-slate-600" placeholder="0.00" type="text" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2" type="button">
                                    <span className="material-symbols-outlined text-lg">calculate</span>
                                    Calculate Estimated Tax
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tax Calendar */}
                    <div className="glass-panel rounded-2xl overflow-hidden mb-6">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-400">calendar_month</span>
                                Tax Calendar
                            </h3>
                            <div className="flex gap-2 text-xs">
                                <span className="px-2 py-1 rounded bg-slate-800/50 text-slate-400 border border-slate-700/50">2025</span>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="relative pl-8 border-l border-white/10 space-y-8">
                                
                                <div className="relative group">
                                    <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[#0F111A] border-2 border-slate-600 group-hover:border-blue-400 transition-colors"></div>
                                    <h4 className="text-sm font-semibold text-white mb-3">June 2025</h4>
                                    
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h5 className="text-sm font-medium text-white">Reminder: Q2 Estimated Tax Payment</h5>
                                                <p className="text-xs text-slate-400 mt-1">Due Date: Jun 15, 2025</p>
                                            </div>
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                                Reminder
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">Reminder for upcoming Q2 estimated tax payment due on Jun 15, 2025.</p>
                                    </div>
                                    
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all mt-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h5 className="text-sm font-medium text-white">Q2 Estimated Tax Payment</h5>
                                                <p className="text-xs text-slate-400 mt-1">Due Date: Jun 15, 2025</p>
                                            </div>
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                                Payment
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">Second quarter estimated tax payment due.</p>
                                    </div>
                                </div>
                                
                                <div className="relative group">
                                    <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[#0F111A] border-2 border-slate-600 group-hover:border-purple-400 transition-colors"></div>
                                    <h4 className="text-sm font-semibold text-white mb-3">September 2025</h4>
                                    
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h5 className="text-sm font-medium text-white">Reminder: Q3 Estimated Tax Payment</h5>
                                                <p className="text-xs text-slate-400 mt-1">Due Date: Sep 15, 2025</p>
                                            </div>
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                                Reminder
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">Reminder for upcoming Q3 estimated tax payment due on Sep 15, 2025.</p>
                                    </div>
                                    
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all mt-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h5 className="text-sm font-medium text-white">Q3 Estimated Tax Payment</h5>
                                                <p className="text-xs text-slate-400 mt-1">Due Date: Sep 15, 2025</p>
                                            </div>
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                                Payment
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">Third quarter estimated tax payment due.</p>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Column: Tax Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-8 rounded-2xl sticky top-24">
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="text-lg font-bold text-white">Tax Summary</h3>
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-orange-400">receipt</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center py-8 text-center border-b border-white/5 mb-6">
                            <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined text-2xl">calculate</span>
                            </div>
                            <p className="text-sm text-slate-400 max-w-[200px] leading-relaxed">Enter your income and deduction details to calculate your estimated quarterly tax.</p>
                        </div>
                        
                        <div className="space-y-4 opacity-50 pointer-events-none filter blur-[1px]">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Gross Income</span>
                                <span className="text-white font-medium">$0.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Deductions</span>
                                <span className="text-red-400 font-medium">-$0.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Taxable Income</span>
                                <span className="text-white font-medium">$0.00</span>
                            </div>
                            <div className="h-px bg-white/10 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300 font-bold">Estimated Tax</span>
                                <span className="text-xl text-white font-bold header-text">$0.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- GLOBAL FOOTER --- */}
            <div className="border-t border-white/5 mt-auto pt-6">
                <FooterCredit />
            </div>

        </main>
    );
};

export default TaxEstimator;