import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import FooterCredit from '../Components/FooterCredit';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
    BarChart, Bar, XAxis, YAxis 
} from 'recharts';

const Dashboard = () => {
    const { user } = useOutletContext();

    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpense: 0,
        netIncome: 0,
        expenseBreakdown: [],
        recentTransactions:[]
    });
    const [loading, setLoading] = useState(true);

    const[isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: 'Software',
        description: '',
        date: new Date().toISOString().split('T')[0] // today's date by default
    });
    const[isSubmitting, setIsSubmitting] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/transactions/dashboard-stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            
            if (result.success) {
                setStats(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    // when page loads -> Load data 
    useEffect(() => {
        fetchDashboardData();
    },[]);

    // Handle form inputs
    const handleInputChange = (e) => {
        setFormData({ ...formData,[e.target.name]: e.target.value });
    };

    // Submit new transaction
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setIsModalOpen(false);
                setFormData({ type: 'expense', amount: '', category: 'Software', description: '', date: new Date().toISOString().split('T')[0] });
                fetchDashboardData();
            } else {
                alert(result.message || "Failed to add transaction");
            }
        } catch (error) {
            console.error("Error adding transaction:", error);
            alert("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
    };

    const savingsRate = stats.totalIncome > 0 
        ? ((stats.netIncome / stats.totalIncome) * 100).toFixed(1) 
        : 0;

    const COLORS =['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#14b8a6'];

    const mockBarData =[
        { name: 'Jan', Income: 0, Expense: 0 },
        { name: 'Feb', Income: 0, Expense: 0 },
        { name: 'Mar', Income: stats.totalIncome, Expense: stats.totalExpense },
    ];

    if (loading) return <div className="text-white p-10">Loading Dashboard...</div>;

    return (
        <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 h-screen overflow-y-auto z-10 relative flex flex-col">
            
            {/* --- MODAL POPUP --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F111A]/80 backdrop-blur-sm px-4">
                    <div className="glass-panel w-full max-w-md p-6 rounded-2xl relative border border-white/10 shadow-2xl">
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <h2 className="text-xl font-bold text-white mb-6">Add Transaction</h2>
                        
                        <form onSubmit={handleAddTransaction} className="space-y-4">
                            {/* Type (Income/Expense) */}
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, type: 'expense'})}
                                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${formData.type === 'expense' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                >
                                    Expense
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, type: 'income'})}
                                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${formData.type === 'income' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                >
                                    Income
                                </button>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="text-xs font-medium text-slate-400 ml-1">Amount (₹)</label>
                                <input 
                                    type="number" 
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    required
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full mt-1 px-4 py-3 glass-input rounded-lg text-sm"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-xs font-medium text-slate-400 ml-1">Category</label>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 px-4 py-3 glass-input rounded-lg text-sm cursor-pointer appearance-none"
                                >
                                    {formData.type === 'income' ? (
                                        <>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Salary">Salary</option>
                                            <option value="Investments">Investments</option>
                                            <option value="Other">Other Income</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Software">Software</option>
                                            <option value="Food & Dining">Food & Dining</option>
                                            <option value="Housing">Housing</option>
                                            <option value="Travel">Travel</option>
                                            <option value="Equipment">Equipment</option>
                                            <option value="Utilities">Utilities</option>
                                            <option value="Other">Other Expense</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-medium text-slate-400 ml-1">Description (Optional)</label>
                                <input 
                                    type="text" 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Figma Subscription"
                                    className="w-full mt-1 px-4 py-3 glass-input rounded-lg text-sm"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="text-xs font-medium text-slate-400 ml-1">Date</label>
                                <input 
                                    type="date" 
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full mt-1 px-4 py-3 glass-input rounded-lg text-sm [color-scheme:dark]"
                                />
                            </div>

                            {/* Submit */}
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Transaction'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* --- END MODAL --- */}

            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="header-text text-3xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-slate-400 mt-1 text-sm">Welcome back, {user.name}. Here's your all-time financial snapshot.</p>
                </div>
                <div className="flex gap-3">
                    {/* TRIGGER MODAL BUTTON */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add Transaction
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Income Card */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group border border-emerald-500/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <span className="material-symbols-outlined text-emerald-400">arrow_upward</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-400">Total Income</p>
                        <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.totalIncome)}</h3>
                    </div>
                </div>

                {/* Total Expense Card */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group border border-red-500/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                            <span className="material-symbols-outlined text-red-400">arrow_downward</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-400">Total Expenses</p>
                        <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.totalExpense)}</h3>
                    </div>
                </div>

                {/* Net Income Card */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group border border-blue-500/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <span className="material-symbols-outlined text-blue-400">account_balance</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-400">Net Income</p>
                        <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.netIncome)}</h3>
                    </div>
                </div>

                {/* Savings Rate Card */}
                <div className="glass-panel p-5 rounded-2xl glass-card-hover group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <span className="material-symbols-outlined text-orange-400">savings</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-400">Savings Rate</p>
                        <h3 className="text-2xl font-bold text-white">{savingsRate}%</h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Cash Flow Bar Chart */}
                <div className="glass-panel p-6 rounded-2xl lg:col-span-2 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-white">Cash Flow (All-Time)</h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockBarData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{ backgroundColor: '#131620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expenses Donut Chart */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col relative">
                    <h3 className="text-lg font-bold text-white mb-2">Expenses by Category</h3>
                    
                    {stats.expenseBreakdown.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                            No expenses recorded yet.
                        </div>
                    ) : (
                        <>
                            <div className="h-48 w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.expenseBreakdown}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="total"
                                            nameKey="_id"
                                            stroke="none"
                                        >
                                            {stats.expenseBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: '#131620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                            formatter={(value) => formatCurrency(value)}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            
                            {/* Legend */}
                            <div className="mt-4 space-y-2">
                                {stats.expenseBreakdown.map((category, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            <span className="text-slate-300 capitalize">{category._id}</span>
                                        </div>
                                        <span className="text-white font-medium">{formatCurrency(category.total)}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-panel rounded-2xl overflow-hidden mb-6">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider">
                                <th className="p-4 font-medium pl-6">Description</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium text-right pr-6">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300 divide-y divide-white/5">
                            {stats.recentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        You have no transactions yet. Click "Add Transaction" to get started.
                                    </td>
                                </tr>
                            ) : (
                                stats.recentTransactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <span className="font-medium text-white">{tx.description || 'No Description'}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400 border border-slate-700 capitalize">
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1.5 text-xs font-medium bg-white/5 px-2 py-1 rounded w-fit border border-white/5 ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'income' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                                                {tx.type === 'income' ? 'Income' : 'Expense'}
                                            </span>
                                        </td>
                                        <td className={`p-4 text-right pr-6 font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="border-t border-white/5 mt-auto">
                <FooterCredit />
            </div>

        </main>
    );
};

export default Dashboard;