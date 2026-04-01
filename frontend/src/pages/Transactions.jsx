import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, ArrowUpRight, ArrowDownLeft, Download, X, Check } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);

const INCOME_BRACKETS = [
    '< $25,000', '$25,000 – $50,000', '$50,000 – $100,000',
    '$100,000 – $200,000', '$200,000 – $400,000', '> $400,000'
];

const EMPTY_FORM = {
    label: '', amount: '', category: '', group: 'EXPENSE',
    date: new Date().toISOString().split('T')[0],
    notes: '', incomeBracket: ''
};

export default function Transactions() {
    const { transactions, addTransaction, deleteTransaction, expenseCategories, incomeCategories } = useAppContext();
    const [tab, setTab] = useState('ALL');
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [toast, setToast] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const cats = form.group === 'INCOME' ? incomeCategories : expenseCategories;
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleCancel = () => { setForm(EMPTY_FORM); setShowForm(false); };

    const handleSave = (e) => {
        e.preventDefault();
        if (!form.label || !form.amount) return;
        addTransaction({
            label: form.label, flow: parseFloat(form.amount),
            category: form.category || (cats[0]?.name ?? 'Other'),
            group: form.group, notes: form.notes, incomeBracket: form.incomeBracket,
            date: new Date(form.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
        setForm(EMPTY_FORM);
        setToast(true);
        setTimeout(() => setToast(false), 2200);
        setShowForm(false);
    };

    const filtered = transactions.filter(t => {
        const byTab = tab === 'ALL' || t.group === tab;
        const bySearch = t.label.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
        return byTab && bySearch;
    });

    const totalIn = transactions.filter(t => t.group === 'INCOME').reduce((s, t) => s + t.flow, 0);
    const totalOut = transactions.filter(t => t.group === 'EXPENSE').reduce((s, t) => s + t.flow, 0);
    const net = totalIn - totalOut;

    // ================= EXPORT CSV =================
const exportCSV = () => {

    const headers = [
        "Description",
        "Category",
        "Type",
        "Amount",
        "Date",
        "Notes",
        "Income Bracket"
    ];

    const rows = filtered.map(t => [
        t.label,
        t.category,
        t.group,
        t.flow,
        t.date,
        t.notes || "",
        t.incomeBracket || ""
    ]);

    let csvContent =
        "data:text/csv;charset=utf-8," +
        [headers, ...rows]
            .map(row => row.join(","))
            .join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");

    document.body.appendChild(link);
    link.click();
};



// ================= EXPORT PDF =================
const exportPDF = () => {

    const doc = new jsPDF();

    doc.text("TaxPal Transactions", 14, 15);

    const tableData = filtered.map(t => [
        t.label,
        t.category,
        t.group,
        `$${t.flow}`,
        t.date
    ]);

    autoTable(doc, {
        startY: 20,
        head: [["Description", "Category", "Type", "Amount", "Date"]],
        body: tableData
    });

    doc.save("transactions.pdf");
};

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-0.5">Transactions</h1>
                    <p className="label">Track earnings & business spending</p>
                </div>
                <div className="flex gap-2 relative">

                 {/* Export Button */}
                    <button
                     className="btn-secondary"
                     onClick={() => setShowExportMenu(v => !v)}
                     >
                <Download size={14} /> Export
                </button>

                 {/* Dropdown */}
                <AnimatePresence>
                 {showExportMenu && (
                 <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-10 left-0 w-36 bg-white rounded-xl shadow-lg border border-slate-200 z-20"
                 >
                    <button
                    onClick={() => {
                        exportCSV();
                        setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                    >
                     Export CSV
                    </button>

                    <button
                        onClick={() => {
                        exportPDF();
                        setShowExportMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                        >
                        Export PDF
                        </button>

                    </motion.div>
                     )}
                     </AnimatePresence>

                     {/* Add Transaction Button */}
                     <button
                        className="btn-primary"
                        onClick={() => setShowForm(true)}
                        >
                         <Plus size={14} /> Add Entry
                        </button>

                            </div>
                            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2.5 p-3.5 rounded-xl mb-5 text-[12px] font-bold"
                        style={{ background: 'var(--income-light)', border: '1px solid #A7F3D0', color: 'var(--income)' }}>
                        <Check size={15} /> Transaction saved successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* KPI pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="card p-5">
                    <p className="label mb-1.5">Total Income</p>
                    <p className="text-[22px] font-black tracking-tight" style={{ color: 'var(--income)' }}>{fmt(totalIn)}</p>
                </div>
                <div className="card p-5">
                    <p className="label mb-1.5">Total Expenses</p>
                    <p className="text-[22px] font-black tracking-tight" style={{ color: 'var(--expense)' }}>{fmt(totalOut)}</p>
                </div>
                <div className="card p-5" style={{ background: '#0F172A' }}>
                    <p className="label mb-1.5" style={{ color: '#64748B' }}>Net Earnings</p>
                    <p className="text-[22px] font-black tracking-tight text-white">{fmt(net)}</p>
                </div>
            </div>

            {/* Table card */}
            <div className="card overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#F1F5F9' }}>
                        {['ALL', 'INCOME', 'EXPENSE'].map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className="px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                                style={{ background: tab === t ? 'white' : 'transparent', color: tab === t ? '#0F172A' : '#94A3B8', boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                            className="form-input pl-9 w-full sm:w-52" style={{ paddingTop: 9, paddingBottom: 9 }}
                        />
                    </div>
                </div>

                {/* Responsive table */}
                <div className="overflow-x-auto">
                    <table className="w-full data-table min-w-[500px]">
                        <thead>
                            <tr>
                                <th className="text-left">Activity</th>
                                <th className="text-left hide-mobile">Category</th>
                                <th className="text-right">Amount</th>
                                <th className="text-right hide-mobile">Type</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence initial={false}>
                                {filtered.map(t => (
                                    <motion.tr key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ background: t.group === 'INCOME' ? 'var(--income-light)' : 'var(--expense-light)', color: t.group === 'INCOME' ? 'var(--income)' : 'var(--expense)' }}>
                                                    {t.group === 'INCOME' ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold text-slate-900 leading-tight">{t.label}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium">{t.date}</p>
                                                    {t.notes && <p className="text-[10px] text-slate-400 italic mt-0.5 truncate max-w-[180px]">{t.notes}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hide-mobile"><span className="badge badge-neutral">{t.category}</span></td>
                                        <td className="text-right">
                                            <span className="text-[14px] font-black" style={{ color: t.group === 'INCOME' ? 'var(--income)' : '#0F172A' }}>
                                                {t.group === 'INCOME' ? '+' : '-'}{fmt(t.flow)}
                                            </span>
                                        </td>
                                        <td className="text-right hide-mobile">
                                            <span className={`badge ${t.group === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>{t.group}</span>
                                        </td>
                                        <td className="text-right w-10">
                                            <button onClick={() => deleteTransaction(t.id)}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                                style={{ color: '#CBD5E1' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--expense-light)'; e.currentTarget.style.color = 'var(--expense)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CBD5E1'; }}>
                                                <Trash2 size={13} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filtered.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-14 label">No transactions found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── ADD FORM MODAL ───────────────────────────── */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={e => e.target === e.currentTarget && handleCancel()}>
                        <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
                            transition={{ duration: 0.2 }} className="modal-box">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 pt-6 pb-5" style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <div>
                                    <h2 className="text-[17px] font-black text-slate-900">New Transaction</h2>
                                    <p className="label mt-0.5">Add income or expense entry</p>
                                </div>
                                <button onClick={handleCancel} className="icon-btn"><X size={16} /></button>
                            </div>

                            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
                                {/* Type toggle */}
                                <div>
                                    <label className="label mb-2 block">Transaction Type</label>
                                    <div className="flex gap-1.5 p-1.5 rounded-xl" style={{ background: '#F1F5F9' }}>
                                        {['INCOME', 'EXPENSE'].map(type => (
                                            <button key={type} type="button"
                                                onClick={() => set('group', type)}
                                                className="flex-1 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest"
                                                style={{
                                                    background: form.group === type ? (type === 'INCOME' ? 'var(--income)' : '#0F172A') : 'transparent',
                                                    color: form.group === type ? 'white' : '#94A3B8',
                                                    boxShadow: form.group === type ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                                                }}>
                                                {type === 'INCOME' ? '↑ Income' : '↓ Expense'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <FieldRow>
                                    <Field label="Description *">
                                        <input className="form-input" placeholder="e.g. Client Payment" value={form.label} onChange={e => set('label', e.target.value)} required />
                                    </Field>
                                    <Field label="Amount *">
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                                            <input type="number" className="form-input pl-7" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} required />
                                        </div>
                                    </Field>
                                </FieldRow>

                                <FieldRow>
                                    <Field label="Category">
                                        <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                                            <option value="">Select category…</option>
                                            {cats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Date">
                                        <input type="date" className="form-input" value={form.date} onChange={e => set('date', e.target.value)} />
                                    </Field>
                                </FieldRow>

                                {/* Income bracket — shows for both, optional */}
                                <Field label="Income Bracket (Optional)">
                                    <select className="form-input" value={form.incomeBracket} onChange={e => set('incomeBracket', e.target.value)}>
                                        <option value="">Select your annual income bracket…</option>
                                        {INCOME_BRACKETS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </Field>

                                {/* Notes */}
                                <Field label="Notes (Optional)">
                                    <textarea className="form-input" placeholder="Add any additional context or details…"
                                        value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
                                </Field>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-2" style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
                                    <button type="button" onClick={handleCancel} className="btn-secondary flex-1">Cancel</button>
                                    <button type="submit" className="btn-primary flex-1"><Check size={14} /> Save Transaction</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}

const FieldRow = ({ children }) => <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
const Field = ({ label, children }) => (
    <div>
        <label className="label mb-1.5 block">{label}</label>
        {children}
    </div>
);
