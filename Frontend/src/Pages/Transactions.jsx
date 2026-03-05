import React, { useEffect, useState } from 'react';
import FooterCredit from '../Components/FooterCredit';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const[loading, setLoading] = useState(true);

    // --- FETCH ALL TRANSACTIONS ---
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/transactions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                
                if (result.success) {
                    setTransactions(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    },[]);

    // --- HELPER FUNCTIONS ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    // Automatically assign colors and icons based on the category!
    const getCategoryStyle = (category) => {
        const styles = {
            'Software': { icon: 'laptop_mac', colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
            'Food & Dining': { icon: 'restaurant', colorClass: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
            'Housing': { icon: 'home', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            'Travel': { icon: 'flight', colorClass: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
            'Equipment': { icon: 'devices', colorClass: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
            'Utilities': { icon: 'bolt', colorClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
            'Freelance': { icon: 'payments', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            'Salary': { icon: 'account_balance_wallet', colorClass: 'text-green-400 bg-green-500/10 border-green-500/20' },
            'Investments': { icon: 'trending_up', colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
            'Other': { icon: 'receipt_long', colorClass: 'text-slate-400 bg-slate-500/10 border-slate-500/20' }
        };

        return styles[category] || styles['Other'];
    };

    if (loading) return <div className="text-white p-10">Loading Transactions...</div>;

    return (
        <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 h-screen overflow-y-auto z-10 relative flex flex-col">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="header-text text-3xl font-bold text-white">Transactions</h1>
                    <p className="text-slate-400 mt-1 text-sm">Manage and track your income and expenses.</p>
                </div>
            </div>

            {/* Filters & Search (Visual Only For Now) */}
            <div className="glass-panel p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-500 text-lg">search</span>
                        </div>
                        <input className="bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 placeholder-slate-500 transition-all hover:bg-white/10" placeholder="Search transactions..." type="text" />
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <span className="text-xs text-slate-500 hidden md:inline">Showing {transactions.length} entries</span>
                </div>
            </div>

            {/* Transactions Table Area */}
            {/* ADDED 'flex-shrink-0' here so the box doesn't get squished! */}
            <div className="glass-panel rounded-2xl overflow-hidden shadow-xl mb-6 flex-shrink-0">
                <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#131620] z-10 shadow-md">
                            <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-white/5">
                                <th className="p-5 font-medium pl-6">Description</th>
                                <th className="p-5 font-medium">Category</th>
                                <th className="p-5 font-medium">Date</th>
                                <th className="p-5 font-medium">Type</th>
                                <th className="p-5 font-medium text-right pr-6">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300 divide-y divide-white/5">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        You have no transactions yet. Go to the Dashboard to add one.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => {
                                    const styleInfo = getCategoryStyle(tx.category);
                                    
                                    return (
                                        <tr key={tx._id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                            {/* FIXED: Wrapped content in a div so the td doesn't break */}
                                            <td className="p-5 pl-6">
                                                <div className="flex items-center gap-4">
                                                    {/* Dynamic Icon */}
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ring-white/5 ${styleInfo.colorClass}`}>
                                                        <span className="material-symbols-outlined text-lg">{styleInfo.icon}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white text-base">{tx.description || 'No Description'}</div>
                                                        <div className="text-xs text-slate-500">{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            {/* Category Tag */}
                                            <td className="p-5">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${styleInfo.colorClass}`}>
                                                    {tx.category}
                                                </span>
                                            </td>
                                            
                                            {/* Date */}
                                            <td className="p-5 text-slate-400">
                                                {new Date(tx.date).toLocaleDateString()}
                                            </td>
                                            
                                            {/* Type (Income/Expense) */}
                                            <td className="p-5">
                                                <span className={`flex items-center gap-1.5 text-xs font-medium bg-white/5 px-2 py-1 rounded w-fit border border-white/5 ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'income' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                                                    {tx.type === 'income' ? 'Income' : 'Expense'}
                                                </span>
                                            </td>
                                            
                                            {/* Amount */}
                                            <td className={`p-5 text-right font-medium text-base pr-6 ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                <div className="p-4 border-t border-white/5 flex items-center justify-between bg-[#131620]">
                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg bg-blue-500 text-white text-sm font-bold flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">1</button>
                        <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-slate-400 text-sm font-medium flex items-center justify-center transition-colors">2</button>
                    </div>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        Next
                    </button>
                </div>
            </div>

            {/* --- GLOBAL FOOTER --- */}
            <div className="border-t border-white/5 mt-auto pt-6 flex-shrink-0">
                <FooterCredit />
            </div>

        </main>
    );
};

export default Transactions;