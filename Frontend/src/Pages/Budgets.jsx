import React, { useEffect, useState } from 'react';
import FooterCredit from '../Components/FooterCredit';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const Budgets = () => {
    const[budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const[isFormOpen, setIsFormOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        category: 'Software',
        limit: ''
    });
    const[isSubmitting, setIsSubmitting] = useState(false);

    const fetchBudgets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/budgets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            
            if (result.success) {
                setBudgets(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch budgets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    },[]);

    const handleInputChange = (e) => {
        setFormData({ ...formData,[e.target.name]: e.target.value });
    };

    const handleEditBudget = (budget) => {
        setFormData({ category: budget.category, limit: budget.limit });
        setIsFormOpen(true);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreateBudget = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    category: formData.category,
                    limit: Number(formData.limit)
                })
            });

            const result = await response.json();

            if (result.success) {
                setFormData({ category: 'Software', limit: '' });
                setIsFormOpen(false);
                fetchBudgets();                                  // Refresh the list
            } else {
                alert(result.message || "Failed to save budget");
            }
        } catch (error) {
            console.error("Error saving budget:", error);
            alert("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
    };

    const getCategoryStyle = (category) => {
        const styles = {
            'Software': { icon: 'laptop_mac', baseColor: 'blue' },
            'Food & Dining': { icon: 'restaurant', baseColor: 'orange' },
            'Housing': { icon: 'home', baseColor: 'emerald' },
            'Travel': { icon: 'flight', baseColor: 'pink' },
            'Equipment': { icon: 'devices', baseColor: 'teal' },
            'Utilities': { icon: 'bolt', baseColor: 'yellow' },
            'Other': { icon: 'category', baseColor: 'purple' }
        };
        return styles[category] || styles['Other'];
    };

    // --- CALCULATIONS FOR UI ---
    const alerts = budgets.filter(b => (b.spent / b.limit) >= 0.85);
    const totalLimit = budgets.reduce((acc, curr) => acc + curr.limit, 0);
    const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
    const overallHealth = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    const COLORS =['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#14b8a6'];

    if (loading) return <div className="text-white p-10">Loading Budgets...</div>;

    return (
        <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 h-screen overflow-y-auto z-10 relative block pb-20">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="header-text text-3xl font-bold text-white">Budgeting Dashboard</h1>
                    <p className="text-slate-400 mt-1 text-sm">Manage your monthly spending limits and track your financial health.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${overallHealth > 90 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                        <span className={`w-2 h-2 rounded-full ${overallHealth > 90 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'}`}></span>
                        <span className={`text-xs font-medium uppercase tracking-wide ${overallHealth > 90 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {overallHealth > 90 ? 'Health: Critical' : 'Health: Good'}
                        </span>
                    </div>
                    <button 
                        onClick={() => {
                            if (!isFormOpen) setFormData({ category: 'Software', limit: '' }); // Reset when opening new
                            setIsFormOpen(!isFormOpen);
                        }}
                        className={`px-4 py-2 rounded-lg text-white text-sm font-bold shadow-lg transition-all flex items-center gap-2 ${isFormOpen ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-500/20'}`}
                    >
                        <span className="material-symbols-outlined text-lg">{isFormOpen ? 'close' : 'add'}</span>
                        {isFormOpen ? 'Cancel' : 'New Budget'}
                    </button>
                </div>
            </div>

            {/* RESTORED: Inline Create/Edit Form */}
            {isFormOpen && (
                <div className="glass-panel p-6 rounded-2xl mb-8 border border-blue-500/30 bg-[#131620]/80 relative overflow-hidden flex-shrink-0 transition-all">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">edit_square</span>
                        {formData.limit ? 'Edit Category Limit' : 'Set Category Limit'}
                    </h2>
                    
                    <form onSubmit={handleCreateBudget} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-5 space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Category</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">category</span>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white appearance-none cursor-pointer bg-transparent"
                                >
                                    <option value="Software">Software</option>
                                    <option value="Food & Dining">Food & Dining</option>
                                    <option value="Housing">Housing</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Other">Other Expense</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-3 text-slate-500 text-sm pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        
                        <div className="md:col-span-4 space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monthly Limit (₹)</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">attach_money</span>
                                <input 
                                    type="number" 
                                    name="limit"
                                    value={formData.limit}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-500" 
                                    placeholder="e.g. 500" 
                                />
                            </div>
                        </div>
                        
                        <div className="md:col-span-3">
                            <button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all disabled:opacity-50">
                                {isSubmitting ? 'Saving...' : 'Save Rule'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <h3 className="text-lg font-bold text-white mb-6 px-1">Active Budgets (Current Month)</h3>
            
            {/* Budgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                
                {budgets.length === 0 ? (
                    <div className="col-span-full p-8 text-center glass-panel rounded-2xl border-dashed border-2 border-white/10">
                        <p className="text-slate-400">You haven't set any budgets yet. Click "New Budget" to start tracking.</p>
                    </div>
                ) : (
                    budgets.map((budget) => {
                        const styleInfo = getCategoryStyle(budget.category);
                        const percentUsed = (budget.spent / budget.limit) * 100;
                        const isOverBudget = percentUsed > 100;
                        const isWarning = percentUsed >= 85 && percentUsed <= 100;
                        
                        let barColor = `bg-${styleInfo.baseColor}-500`;
                        let textColor = `text-${styleInfo.baseColor}-400`;
                        let shadowColor = `rgba(59,130,246,0.6)`;
                        
                        if (isOverBudget) {
                            barColor = 'bg-red-500';
                            textColor = 'text-red-400';
                            shadowColor = 'rgba(239,68,68,0.6)';
                        } else if (isWarning) {
                            barColor = 'bg-orange-500';
                            textColor = 'text-orange-400';
                            shadowColor = 'rgba(249,115,22,0.6)';
                        }

                        const barWidth = Math.min(percentUsed, 100);

                        return (
                            <div key={budget._id} className={`glass-panel p-5 rounded-2xl glass-card-hover group relative overflow-hidden ${isOverBudget ? 'border border-red-500/30' : ''}`}>
                                {isOverBudget && <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>}
                                
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg bg-${styleInfo.baseColor}-500/10 border border-${styleInfo.baseColor}-500/20 flex items-center justify-center`}>
                                            <span className={`material-symbols-outlined text-${styleInfo.baseColor}-400`}>{styleInfo.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{budget.category}</h4>
                                        </div>
                                    </div>
                                    {/* EDIT BUTTON ADDED HERE */}
                                    <button 
                                        onClick={() => handleEditBudget(budget)}
                                        className="text-slate-500 hover:text-blue-400 transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg"
                                        title="Edit Limit"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                </div>
                                
                                <div className="space-y-1 mb-4 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <span className={`text-2xl font-bold ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                                            {formatCurrency(budget.spent)}
                                            <span className="text-sm text-slate-500 font-normal"> / {formatCurrency(budget.limit)}</span>
                                        </span>
                                        <span className={`text-xs font-bold ${textColor} bg-white/5 px-2 py-0.5 rounded border border-white/5`}>
                                            {percentUsed.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="relative w-full h-2 bg-slate-700/30 rounded-full overflow-hidden mb-3">
                                    <div 
                                        className={`absolute top-0 left-0 h-full ${barColor} rounded-full neon-bar transition-all duration-500`}
                                        style={{ width: `${barWidth}%`, boxShadow: `0 0 10px ${shadowColor}` }}
                                    ></div>
                                </div>
                                
                                <div className="flex justify-between text-xs text-slate-400 border-t border-white/5 pt-3 mt-2">
                                    <div>
                                        <span className="block text-slate-500 mb-0.5">Status</span>
                                        <span className={`font-medium ${isOverBudget ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-emerald-400'}`}>
                                            {isOverBudget ? 'Exceeded limit' : 'On track'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-slate-500 mb-0.5">{isOverBudget ? 'Over Budget' : 'Remaining'}</span>
                                        <span className={`font-medium ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                                            {isOverBudget ? `-${formatCurrency(budget.spent - budget.limit)}` : formatCurrency(budget.limit - budget.spent)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Quick Add Button at the end */}
                <div 
                    onClick={() => {
                        setFormData({ category: 'Software', limit: '' });
                        setIsFormOpen(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="glass-panel p-5 rounded-2xl glass-card-hover group relative overflow-hidden border-dashed border-2 border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/30 transition-all min-h-[200px]"
                >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-blue-400 transition-colors">add</span>
                    </div>
                    <h4 className="text-white font-bold text-sm">Add Category</h4>
                    <p className="text-slate-500 text-xs mt-1">Create a new budget limit</p>
                </div>
            </div>

            {/* Budget Alerts & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 flex-shrink-0">
                
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col h-[350px]">
                    <h3 className="text-lg font-bold text-white mb-6">Budget Alerts</h3>
                    <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {alerts.length === 0 ? (
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-4 items-start">
                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">All Clear!</h4>
                                    <p className="text-xs text-slate-400 mt-1">You are currently within limits for all your budgeted categories.</p>
                                </div>
                            </div>
                        ) : (
                            alerts.map(alert => {
                                const isOver = alert.spent > alert.limit;
                                return (
                                    <div key={`alert-${alert._id}`} className={`p-4 rounded-xl border flex gap-4 items-start ${isOver ? 'bg-red-500/10 border-red-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                                        <div className={`p-2 rounded-lg ${isOver ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                            <span className="material-symbols-outlined text-lg">warning</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">
                                                {isOver ? `Over Budget: ${alert.category}` : `Nearing Limit: ${alert.category}`}
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {isOver 
                                                    ? `You've exceeded your monthly limit by ${formatCurrency(alert.spent - alert.limit)}.` 
                                                    : `You have spent ${((alert.spent / alert.limit)*100).toFixed(0)}% of your limit. Only ${formatCurrency(alert.limit - alert.spent)} remaining.`}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col md:flex-row items-center gap-8 relative h-[350px]">
                    <div className="flex-1 w-full h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Current Month Allocation</h3>
                        </div>
                        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
                            {budgets.length > 0 ? budgets.map((b, idx) => {
                                const percentage = totalLimit > 0 ? (b.limit / totalLimit) * 100 : 0;
                                return (
                                    <div key={`alloc-${b._id}`} className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>{b.category} Limit</span>
                                            <span className="text-white">{percentage.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700/30 rounded-full h-1.5 overflow-hidden">
                                            <div className="h-1.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <p className="text-slate-500 text-sm">Add budgets to see allocation breakdown.</p>
                            )}
                        </div>
                    </div>

                    {/* Radial Recharts Chart */}
                    <div className="relative w-48 h-48 flex-shrink-0">
                        {budgets.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={budgets}
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="limit"
                                        nameKey="category"
                                        stroke="none"
                                    >
                                        {budgets.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#131620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                        formatter={(value) => formatCurrency(value)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full rounded-full border-8 border-slate-800"></div>
                        )}
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xl font-bold text-white">{formatCurrency(totalLimit)}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Limit</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- GLOBAL FOOTER --- */}
            <div className="border-t border-white/5 mt-8 pt-6">
                <FooterCredit />
            </div>

        </main>
    );
};

export default Budgets;