import React from 'react';
import FooterCredit from '../Components/FooterCredit';

const Transactions = () => {
    return (
        <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 h-screen overflow-y-auto z-10 relative flex flex-col">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="header-text text-3xl font-bold text-white">Transactions</h1>
                    <p className="text-slate-400 mt-1 text-sm">Manage and track your income and expenses.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Log Transaction
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="glass-panel p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-500 text-lg">search</span>
                        </div>
                        <input className="bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 placeholder-slate-500 transition-all hover:bg-white/10" placeholder="Search transactions..." type="text" />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="relative min-w-[140px]">
                            <select className="bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none cursor-pointer hover:bg-white/10 transition-colors">
                                <option>All Dates</option>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Month</option>
                                <option>Last Month</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                                <span className="material-symbols-outlined text-lg">calendar_today</span>
                            </div>
                        </div>
                        <div className="relative min-w-[140px]">
                            <select className="bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none cursor-pointer hover:bg-white/10 transition-colors">
                                <option>All Categories</option>
                                <option>Software</option>
                                <option>Hosting</option>
                                <option>Design</option>
                                <option>Food &amp; Dining</option>
                                <option>Equipment</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                                <span className="material-symbols-outlined text-lg">category</span>
                            </div>
                        </div>
                        <div className="relative min-w-[140px]">
                            <select className="bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none cursor-pointer hover:bg-white/10 transition-colors">
                                <option>All Types</option>
                                <option>Income</option>
                                <option>Expense</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                                <span className="material-symbols-outlined text-lg">filter_list</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <span className="text-xs text-slate-500 hidden md:inline">Showing 15 of 124</span>
                    <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                </div>
            </div>

            {/* Transactions Table Area */}
            <div className="glass-panel rounded-2xl overflow-hidden shadow-xl mb-6">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider border-b border-white/5">
                                <th className="p-5 font-medium pl-6">Description</th>
                                <th className="p-5 font-medium">Category</th>
                                <th className="p-5 font-medium">Date</th>
                                <th className="p-5 font-medium">Type</th>
                                <th className="p-5 font-medium text-right">Amount</th>
                                <th className="p-5 font-medium w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300 divide-y divide-white/5">

                            <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="p-5 pl-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 ring-1 ring-white/5">
                                        <i className="fab fa-figma text-lg"></i>
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-base">Figma Subscription</div>
                                        <div className="text-xs text-slate-500">Monthly Pro Plan</div>
                                    </div>
                                </td>
                                <td className="p-5"><span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-xs font-medium text-blue-400 border border-blue-500/20">Software</span></td>
                                <td className="p-5 text-slate-400">Oct 24, 2023</td>
                                <td className="p-5">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded w-fit border border-white/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Expense
                                    </span>
                                </td>
                                <td className="p-5 text-right font-medium text-white text-base">-$15.00</td>
                                <td className="p-5 text-center">
                                    <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                </td>
                            </tr>

                            <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="p-5 pl-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 ring-1 ring-white/5">
                                        <span className="material-symbols-outlined text-lg">payments</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-base">Client Payment - Design</div>
                                        <div className="text-xs text-slate-500">Invoice #INV-2023-001</div>
                                    </div>
                                </td>
                                <td className="p-5"><span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-xs font-medium text-emerald-400 border border-emerald-500/20">Income</span></td>
                                <td className="p-5 text-slate-400">Oct 22, 2023</td>
                                <td className="p-5">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded w-fit border border-white/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Income
                                    </span>
                                </td>
                                <td className="p-5 text-right font-medium text-emerald-400 text-base">+$2,450.00</td>
                                <td className="p-5 text-center">
                                    <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                </td>
                            </tr>

                            <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="p-5 pl-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 ring-1 ring-white/5">
                                        <span className="material-symbols-outlined text-lg">coffee</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-base">Starbucks Meeting</div>
                                        <div className="text-xs text-slate-500">Client Sync</div>
                                    </div>
                                </td>
                                <td className="p-5"><span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-xs font-medium text-orange-400 border border-orange-500/20">Food &amp; Dining</span></td>
                                <td className="p-5 text-slate-400">Oct 20, 2023</td>
                                <td className="p-5">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded w-fit border border-white/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Expense
                                    </span>
                                </td>
                                <td className="p-5 text-right font-medium text-white text-base">-$12.50</td>
                                <td className="p-5 text-center">
                                    <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                </td>
                            </tr>

                            <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="p-5 pl-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 ring-1 ring-white/5">
                                        <i className="fab fa-aws text-lg"></i>
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-base">AWS Server Costs</div>
                                        <div className="text-xs text-slate-500">Infrastructure</div>
                                    </div>
                                </td>
                                <td className="p-5"><span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-xs font-medium text-purple-400 border border-purple-500/20">Hosting</span></td>
                                <td className="p-5 text-slate-400">Oct 18, 2023</td>
                                <td className="p-5">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded w-fit border border-white/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Expense
                                    </span>
                                </td>
                                <td className="p-5 text-right font-medium text-white text-base">-$64.20</td>
                                <td className="p-5 text-center">
                                    <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                </td>
                            </tr>

                            <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="p-5 pl-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 ring-1 ring-white/5">
                                        <span className="material-symbols-outlined text-lg">laptop_mac</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-base">New Monitor</div>
                                        <div className="text-xs text-slate-500">Office Upgrade</div>
                                    </div>
                                </td>
                                <td className="p-5"><span className="px-2.5 py-1 rounded-md bg-teal-500/10 text-xs font-medium text-teal-400 border border-teal-500/20">Equipment</span></td>
                                <td className="p-5 text-slate-400">Oct 15, 2023</td>
                                <td className="p-5">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded w-fit border border-white/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Expense
                                    </span>
                                </td>
                                <td className="p-5 text-right font-medium text-white text-base">-$349.99</td>
                                <td className="p-5 text-center">
                                    <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                </td>
                            </tr>

                            <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="p-5 pl-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 ring-1 ring-white/5">
                                        <span className="material-symbols-outlined text-lg">flight</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-base">Uber - Client Meeting</div>
                                        <div className="text-xs text-slate-500">Transportation</div>
                                    </div>
                                </td>
                                <td className="p-5"><span className="px-2.5 py-1 rounded-md bg-pink-500/10 text-xs font-medium text-pink-400 border border-pink-500/20">Travel</span></td>
                                <td className="p-5 text-slate-400">Oct 12, 2023</td>
                                <td className="p-5">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded w-fit border border-white/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Expense
                                    </span>
                                </td>
                                <td className="p-5 text-right font-medium text-white text-base">-$24.50</td>
                                <td className="p-5 text-center">
                                    <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                </td>
                            </tr>

                            <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="p-5 pl-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 ring-1 ring-white/5">
                                        <span className="material-symbols-outlined text-lg">bolt</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-base">Internet Bill</div>
                                        <div className="text-xs text-slate-500">Monthly Utility</div>
                                    </div>
                                </td>
                                <td className="p-5"><span className="px-2.5 py-1 rounded-md bg-yellow-500/10 text-xs font-medium text-yellow-400 border border-yellow-500/20">Utilities</span></td>
                                <td className="p-5 text-slate-400">Oct 10, 2023</td>
                                <td className="p-5">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded w-fit border border-white/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Expense
                                    </span>
                                </td>
                                <td className="p-5 text-right font-medium text-white text-base">-$89.99</td>
                                <td className="p-5 text-center">
                                    <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                </td>
                            </tr>

                            <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="p-5 pl-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 ring-1 ring-white/5">
                                        <span className="material-symbols-outlined text-lg">language</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-base">Domain Renewal</div>
                                        <div className="text-xs text-slate-500">Yearly Namecheap</div>
                                    </div>
                                </td>
                                <td className="p-5"><span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-xs font-medium text-purple-400 border border-purple-500/20">Hosting</span></td>
                                <td className="p-5 text-slate-400">Oct 05, 2023</td>
                                <td className="p-5">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded w-fit border border-white/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Expense
                                    </span>
                                </td>
                                <td className="p-5 text-right font-medium text-white text-base">-$12.18</td>
                                <td className="p-5 text-center">
                                    <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-white/5 flex items-center justify-between">
                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg bg-blue-500 text-white text-sm font-bold flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">1</button>
                        <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-slate-400 text-sm font-medium flex items-center justify-center transition-colors">2</button>
                        <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-slate-400 text-sm font-medium flex items-center justify-center transition-colors">3</button>
                        <span className="text-slate-600">...</span>
                        <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-slate-400 text-sm font-medium flex items-center justify-center transition-colors">8</button>
                    </div>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            </div>

            <FooterCredit />
        </main>
    );
};

export default Transactions;