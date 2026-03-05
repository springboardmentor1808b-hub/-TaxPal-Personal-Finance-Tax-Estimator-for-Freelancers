import React from 'react';
import FooterCredit from '../Components/FooterCredit';

const Reports = () => {
    return (
        <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 h-screen overflow-y-auto z-10 relative flex flex-col">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="header-text text-3xl font-bold text-white">Reports &amp; Export</h1>
                    <p className="text-slate-400 mt-1 text-sm">Generate financial statements and tax documents for your records.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg glass-panel text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">history</span>
                        Export History
                    </button>
                </div>
            </div>

            {/* Generate Report Form */}
            <div className="glass-panel p-6 rounded-2xl mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                        <span className="material-symbols-outlined text-pink-400">tune</span>
                    </div>
                    <h2 className="text-lg font-bold text-white">Generate Report</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Report Type</label>
                        <select className="w-full bg-[#0F111A]/60 border border-white/10 rounded-lg text-white text-sm px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors">
                            <option>Income Statement</option>
                            <option>Expense Report</option>
                            <option>Tax Summary</option>
                            <option>Balance Sheet</option>
                            <option>Cash Flow Statement</option>
                        </select>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Period</label>
                        <select className="w-full bg-[#0F111A]/60 border border-white/10 rounded-lg text-white text-sm px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors">
                            <option>Current Month</option>
                            <option>Last Month</option>
                            <option>Last Quarter</option>
                            <option>Year to Date</option>
                            <option>Last Year</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Format</label>
                        <select className="w-full bg-[#0F111A]/60 border border-white/10 rounded-lg text-white text-sm px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors">
                            <option>PDF Document (.pdf)</option>
                            <option>CSV Spreadsheet (.csv)</option>
                            <option>Excel Workbook (.xlsx)</option>
                        </select>
                    </div>
                    
                    <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
                            Reset
                        </button>
                        <button className="flex-[2] px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Preview Placeholder */}
            <div className="glass-panel rounded-2xl mb-8 flex flex-col h-[500px]">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-500 text-lg">visibility</span>
                        Report Preview
                    </h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-medium transition-all flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">print</span>
                            Print
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/20 text-xs font-medium transition-all flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">download</span>
                            Download
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center p-12 relative report-preview-placeholder">
                    <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl backdrop-blur-sm">
                        <span className="material-symbols-outlined text-5xl text-slate-500/50">description</span>
                    </div>
                    <h3 className="text-lg font-medium text-slate-300 mb-2">Select a report to preview</h3>
                    <p className="text-sm text-slate-500 text-center max-w-sm">Generated reports will appear here for your review before downloading. You can customize the date range and format above.</p>
                </div>
            </div>

            {/* Recent Reports Table */}
            <div className="glass-panel rounded-2xl overflow-hidden mb-6">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Recent Reports</h3>
                    <div className="flex gap-2">
                        <button className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">refresh</span>
                        </button>
                        <button className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">filter_list</span>
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider">
                                <th className="p-4 font-medium">Report Name</th>
                                <th className="p-4 font-medium">Generated</th>
                                <th className="p-4 font-medium">Period</th>
                                <th className="p-4 font-medium">Format</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300 divide-y divide-white/5">
                            <tr className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <span className="material-symbols-outlined text-sm">summarize</span>
                                    </div>
                                    <span className="font-medium text-white">Income Statement - Q3</span>
                                </td>
                                <td className="p-4 text-slate-400">Oct 24, 2023</td>
                                <td className="p-4"><span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400 border border-slate-700">Jul 1 - Sep 30</span></td>
                                <td className="p-4"><span className="flex items-center gap-1.5"><i className="fas fa-file-pdf text-red-400"></i> PDF</span></td>
                                <td className="p-4 text-right">
                                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Download</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <span className="material-symbols-outlined text-sm">table_chart</span>
                                    </div>
                                    <span className="font-medium text-white">Expense Breakdown</span>
                                </td>
                                <td className="p-4 text-slate-400">Oct 22, 2023</td>
                                <td className="p-4"><span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400 border border-slate-700">Sep 1 - Sep 30</span></td>
                                <td className="p-4"><span className="flex items-center gap-1.5"><i className="fas fa-file-csv text-green-400"></i> CSV</span></td>
                                <td className="p-4 text-right">
                                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Download</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <span className="material-symbols-outlined text-sm">receipt_long</span>
                                    </div>
                                    <span className="font-medium text-white">Tax Summary</span>
                                </td>
                                <td className="p-4 text-slate-400">Oct 15, 2023</td>
                                <td className="p-4"><span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400 border border-slate-700">Jan 1 - Oct 15</span></td>
                                <td className="p-4"><span className="flex items-center gap-1.5"><i className="fas fa-file-pdf text-red-400"></i> PDF</span></td>
                                <td className="p-4 text-right">
                                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Download</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- GLOBAL FOOTER --- */}
            <div className="border-t border-white/5 mt-auto pt-6">
                <FooterCredit />
            </div>

        </main>
    );
};

export default Reports;