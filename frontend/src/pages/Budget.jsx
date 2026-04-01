import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertTriangle, ShieldCheck, TrendingUp, Trash2, X, Check, Target, Calendar } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';

const COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#0EA5E9', '#A855F7', '#64748B'];
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);

const EMPTY_FORM = {
    category: '', limit: '', month: new Date().toISOString().slice(0, 7), description: ''
};

export default function Budget() {
    const { budgets, addBudget, deleteBudget, expenseCategories } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const totalBudgeted = budgets.reduce((s, b) => s + b.limit, 0);
    const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
    const remaining = totalBudgeted - totalSpent;
    const usagePct = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    const handleCreate = (e) => {
        e.preventDefault();
        if (!form.category || !form.limit) return;
        addBudget({
            name: form.category,
            limit: parseFloat(form.limit),
            color: COLORS[budgets.length % COLORS.length],
            month: form.month,
            description: form.description,
        });
        setForm(EMPTY_FORM);
        setShowModal(false);
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-0.5">Budgets</h1>
                    <p className="label">Stay on track with your spending goals</p>
                </div>
                <button className="btn-primary self-start sm:self-auto" onClick={() => setShowModal(true)}>
                    <Plus size={14} /> New Budget
                </button>
            </div>

            {/* Summary row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Dark card */}
                <div className="card p-6 relative overflow-hidden" style={{ background: '#0F172A', border: '1px solid #1E293B' }}>
                    <div className="absolute top-0 right-0 w-28 h-28 rounded-full translate-x-10 -translate-y-10"
                        style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.3) 0%,transparent 70%)' }} />
                    <p className="label mb-2" style={{ color: '#64748B' }}>Total Budgeted</p>
                    <p className="text-[28px] font-black tracking-tight text-white mb-4">{fmt(totalBudgeted)}</p>
                    <div className="flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                        <TrendingUp size={13} style={{ color: 'var(--income)' }} />
                        <span className="text-[11px] font-semibold" style={{ color: '#64748B' }}>+8% from last month</span>
                    </div>
                </div>
                {/* Spent */}
                <div className="card p-6">
                    <p className="label mb-2">Total Spent</p>
                    <p className="text-[28px] font-black tracking-tight text-slate-900 mb-3">{fmt(totalSpent)}</p>
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="label">Usage</span>
                        <span className="text-[11px] font-black text-slate-700">{usagePct.toFixed(0)}%</span>
                    </div>
                    <div className="progress-track">
                        <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${usagePct}%` }}
                            style={{ background: usagePct > 90 ? 'var(--expense)' : usagePct > 70 ? 'var(--warning)' : '#0F172A' }} />
                    </div>
                </div>
                {/* Health */}
                <div className="card p-6"
                    style={{ background: remaining >= 0 ? 'var(--income-light)' : 'var(--expense-light)', border: `1px solid ${remaining >= 0 ? '#A7F3D0' : '#FECDD3'}` }}>
                    <p className="label mb-2" style={{ color: remaining >= 0 ? 'var(--income)' : 'var(--expense)' }}>Financial Health</p>
                    <p className="text-[24px] font-black tracking-tight mb-4" style={{ color: remaining >= 0 ? '#064E3B' : '#881337' }}>
                        {remaining >= 0 ? 'On Track' : 'Over Budget'}
                    </p>
                    <div className="flex items-center gap-2" style={{ borderTop: `1px solid ${remaining >= 0 ? '#6EE7B7' : '#FDA4AF'}`, paddingTop: 14 }}>
                        {remaining >= 0 ? <ShieldCheck size={13} style={{ color: 'var(--income)' }} /> : <AlertTriangle size={13} style={{ color: 'var(--expense)' }} />}
                        <span className="text-[11px] font-bold" style={{ color: remaining >= 0 ? 'var(--income)' : 'var(--expense)' }}>
                            {remaining >= 0 ? `Safe to spend ${fmt(remaining)} more` : `${fmt(Math.abs(remaining))} over budget`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Budget grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {budgets.map(b => <BudgetCard key={b.id} budget={b} onDelete={deleteBudget} />)}
                </AnimatePresence>
                {budgets.length === 0 && (
                    <div className="col-span-2 flex flex-col items-center justify-center py-20 rounded-2xl"
                        style={{ border: '2px dashed #E2E8F0', background: 'rgba(255,255,255,0.5)' }}>
                        <p className="label mb-3">No budgets yet</p>
                        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Create First Budget</button>
                    </div>
                )}
            </div>

            {/* ── CREATE BUDGET MODAL ── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay"
                        onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                        <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24 }}
                            transition={{ duration: 0.2 }} className="modal-box">

                            {/* Modal header */}
                            <div className="flex items-center justify-between px-6 pt-6 pb-5" style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <div>
                                    <h2 className="text-[17px] font-black text-slate-900">Create New Budget</h2>
                                    <p className="label mt-0.5">Set a monthly spending limit</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="icon-btn"><X size={16} /></button>
                            </div>

                            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
                                {/* Category + Amount */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Category *">
                                        <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)} required>
                                            <option value="">Select a category…</option>
                                            {expenseCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            <option value="Custom">Custom…</option>
                                        </select>
                                    </Field>
                                    <Field label="Budget Amount *">
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-[15px]">$</span>
                                            <input type="number" className="form-input pl-7" placeholder="0.00"
                                                value={form.limit} onChange={e => set('limit', e.target.value)} required />
                                        </div>
                                    </Field>
                                </div>

                                {/* Month */}
                                <Field label="Month">
                                    <div className="relative">
                                        <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input type="month" className="form-input pl-9" value={form.month}
                                            onChange={e => set('month', e.target.value)} />
                                    </div>
                                </Field>

                                {/* Description */}
                                <Field label="Description (Optional)">
                                    <textarea className="form-input" placeholder="Add any additional details…"
                                        value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
                                </Field>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-1" style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                                    <button type="submit" className="btn-success flex-1"><Check size={14} /> Create Budget</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}

function BudgetCard({ budget, onDelete }) {
    const pct = Math.min((budget.spent / budget.limit) * 100, 100);
    const warns = pct > 85;
    const full = pct >= 100;

    return (
        <motion.div layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }} className="card p-6 relative overflow-hidden group">
            {/* Color blob */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full translate-x-8 -translate-y-8 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: budget.color }} />

            <div className="relative flex justify-between items-start mb-5">
                <div>
                    <h3 className="text-[16px] font-black text-slate-900 mb-0.5">{budget.name}</h3>
                    <p className="label">Limit: {fmt(budget.limit)}/mo{budget.month ? ` · ${budget.month}` : ''}</p>
                    {budget.description && <p className="text-[11px] text-slate-400 italic mt-1 max-w-[180px] leading-snug">{budget.description}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: budget.color }}>
                        <Target size={17} />
                    </div>
                    <button onClick={() => onDelete(budget.id)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        style={{ color: '#CBD5E1' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--expense-light)'; e.currentTarget.style.color = 'var(--expense)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CBD5E1'; }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <div className="space-y-2.5">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="label mb-0.5">Spent</p>
                        <p className="text-[22px] font-black tracking-tight text-slate-900">{fmt(budget.spent)}</p>
                    </div>
                    <span className={`badge ${full ? 'badge-expense' : warns ? 'badge-warning' : 'badge-neutral'}`}>{pct.toFixed(0)}% Used</span>
                </div>
                <div className="progress-track">
                    <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        style={{ background: full ? 'var(--expense)' : warns ? 'var(--warning)' : budget.color }} />
                </div>
                <div className="flex justify-between">
                    <span className="text-[11px] font-medium text-slate-400">{fmt(budget.spent)} spent</span>
                    <span className="text-[11px] font-medium text-slate-400">{fmt(budget.limit - budget.spent)} left</span>
                </div>
            </div>

            {(warns || full) && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-xl"
                    style={{ background: full ? 'var(--expense-light)' : 'var(--warning-light)', border: `1px dashed ${full ? '#FECDD3' : '#FDE68A'}` }}>
                    <AlertTriangle size={13} style={{ color: full ? 'var(--expense)' : 'var(--warning)' }} />
                    <span className="text-[11px] font-bold" style={{ color: full ? 'var(--expense)' : 'var(--warning)' }}>
                        {full ? 'Budget exceeded!' : 'Approaching budget limit'}
                    </span>
                </div>
            )}
        </motion.div>
    );
}

const Field = ({ label, children }) => (
    <div>
        <label className="label mb-1.5 block">{label}</label>
        {children}
    </div>
);
