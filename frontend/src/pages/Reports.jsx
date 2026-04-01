import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Download, BarChart3, PieChart as PieIcon,
    TrendingUp, Check, X, Eye, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
const fmtDate = () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function Reports() {
    const { transactions, summary, taxCalculations } = useAppContext();
    const [config, setConfig] = useState({ type: 'Financial Summary', period: 'Current Month', format: 'PDF (.pdf)' });
    const [generated, setGenerated] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const set = (k, v) => setConfig(p => ({ ...p, [k]: v }));

    const totalIn = summary.totalIncome;
    const totalOut = summary.totalExpenses;
    const profitMargin = totalIn > 0 ? ((summary.netEarnings / totalIn) * 100).toFixed(1) : '0.0';
    const taxEff = totalIn > 0 ? (100 - (summary.estTax / totalIn) * 100).toFixed(1) : '100.0';

    const catBreakdown = (() => {
        const map = {};
        transactions.filter(t => t.group === 'EXPENSE').forEach(t => { map[t.category] = (map[t.category] || 0) + t.flow; });
        const total = Object.values(map).reduce((s, v) => s + v, 0);
        return Object.entries(map).map(([cat, amt]) => ({ cat, amt, pct: total > 0 ? (amt / total) * 100 : 0 })).sort((a, b) => b.amt - a.amt);
    })();

    const recentFiles = [
        { id: 1, name: 'Tax_Year_2025_Summary', date: 'May 01, 2025', size: '1.2 MB' },
        { id: 2, name: 'Expense_Breakdown_Q1', date: 'Apr 15, 2025', size: '2.4 MB' },
        { id: 3, name: 'Category_Comparison_2024', date: 'Jan 10, 2025', size: '0.8 MB' },
    ];

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

        const rows = transactions.map(t => [
            t.label,
            t.category,
            t.group,
            t.flow,
            t.date,
            t.notes || "",
            t.incomeBracket || ""
            ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map(row => row.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "taxpal_report.csv";
        document.body.appendChild(link);
        link.click();
        };

        // ================= EXPORT PDF =================
            const exportPDF = () => {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("TaxPal Financial Report", 14, 15);

            doc.setFontSize(11);
            doc.text(`Period: ${config.period}`, 14, 25);
            doc.text(`Generated: ${fmtDate()}`, 14, 32);

            const tableData = transactions.map(t => [
            t.label,
            t.category,
            t.group,
            `$${t.flow}`,
            t.date
            ]);

            autoTable(doc, {
            startY: 40,
            head: [["Description", "Category", "Type", "Amount", "Date"]],
            body: tableData
            });

            doc.save("taxpal_report.pdf");
            };

    const handleGenerate = () => {
        if (config.format.includes("PDF")) {
        exportPDF();
        }

        if (config.format.includes("CSV")) {
            exportCSV();
        }

        setGenerated(true);

        setTimeout(() => setGenerated(false), 2000);
            };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-0.5">Financial Reports</h1>
                <p className="label">Generate and download your financial reports</p>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <MetricCard icon={<BarChart3 />} label="Total Revenue" value={`$${(totalIn / 1000).toFixed(1)}k`} color="accent" />
                <MetricCard icon={<PieIcon />} label="Tax Efficiency" value={`${taxEff}%`} color="income" />
                <MetricCard icon={<TrendingUp />} label="Profit Margin" value={`${profitMargin}%`} color="warning" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
                {/* Generator */}
                <div className="card p-6">
                    <h3 className="text-[16px] font-black text-slate-900 mb-5 italic">Generate Report</h3>
                    <div className="space-y-4 mb-5">
                        <Field label="Report Type">
                            <select className="form-input" value={config.type} onChange={e => set('type', e.target.value)}>
                                {['Financial Summary', 'Expense Detail', 'Income Detail', 'Tax Projections', 'Category Breakdown'].map(o => <option key={o}>{o}</option>)}
                            </select>
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Period">
                                <select className="form-input" value={config.period} onChange={e => set('period', e.target.value)}>
                                    {['Current Month', 'Past 3 Months', 'Year to Date', 'Past Year'].map(o => <option key={o}>{o}</option>)}
                                </select>
                            </Field>
                            <Field label="Format">
                                <select className="form-input" value={config.format} onChange={e => set('format', e.target.value)}>
                                    {['PDF (.pdf)', 'Excel (.xlsx)', 'CSV (.csv)', 'JSON (.json)'].map(o => <option key={o}>{o}</option>)}
                                </select>
                            </Field>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setShowPreview(true)} className="btn-secondary flex-1">
                            <Eye size={14} /> Preview
                        </button>
                        <button onClick={handleGenerate} className="btn-primary flex-1"
                            style={generated ? { background: 'var(--income)', boxShadow: '0 2px 10px rgba(16,185,129,0.25)' } : {}}>
                            {generated ? <><Check size={14} /> Ready!</> : <><Download size={14} /> Download</>}
                        </button>
                    </div>
                </div>

                {/* Recent downloads */}
                <div className="card overflow-hidden">
                    <div className="px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <h3 className="text-[16px] font-black text-slate-900 italic">Recent Downloads</h3>
                    </div>
                    {recentFiles.map((f, i) => (
                        <div key={f.id} className="flex items-center justify-between px-5 py-4 group transition-all"
                            style={{ borderBottom: i < recentFiles.length - 1 ? '1px solid #F8FAFC' : 'none' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#FAFBFC'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                            <div className="flex items-center gap-3.5">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F1F5F9', color: '#94A3B8' }}>
                                    <FileText size={17} />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-slate-900">{f.name}</p>
                                    <p className="label">{f.date} · {f.size}</p>
                                </div>
                            </div>
                            <button className="icon-btn opacity-0 group-hover:opacity-100"><Download size={15} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Spending breakdown */}
            <div className="card p-6 mb-5">
                <h3 className="text-[16px] font-black text-slate-900 mb-5 italic">Spending by Category</h3>
                {catBreakdown.length > 0 ? (
                    <div className="space-y-4">
                        {catBreakdown.map(({ cat, amt, pct }) => (
                            <div key={cat} className="flex items-center gap-4">
                                <span className="text-[12px] font-bold text-slate-700 w-36 shrink-0 truncate">{cat}</span>
                                <div className="flex-1 progress-track">
                                    <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                        style={{ background: 'var(--accent)' }} />
                                </div>
                                <div className="text-right w-28 shrink-0">
                                    <span className="text-[13px] font-black text-slate-900">{fmt(amt)}</span>
                                    <span className="text-[10px] text-slate-400 ml-1">({pct.toFixed(0)}%)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 label">No expense transactions yet</div>
                )}
            </div>

            {/* Saved tax calculations */}
            {taxCalculations.length > 0 && (
                <div className="card overflow-hidden">
                    <div className="px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <h3 className="text-[16px] font-black text-slate-900 italic">Saved Tax Calculations</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full data-table min-w-[480px]">
                            <thead><tr>
                                <th className="text-left">Quarter</th>
                                <th className="text-left">State</th>
                                <th className="text-right">Quarterly Due</th>
                                <th className="text-right">Eff. Rate</th>
                                <th className="text-right">Saved</th>
                            </tr></thead>
                            <tbody>
                                {taxCalculations.map(c => (
                                    <tr key={c.id}>
                                        <td className="font-bold text-slate-900">{c.quarter}</td>
                                        <td><span className="badge badge-neutral">{c.state}</span></td>
                                        <td className="text-right font-black" style={{ color: 'var(--income)' }}>{fmt(c.quarterlyPayment)}</td>
                                        <td className="text-right font-bold text-slate-500">{c.effectiveRate.toFixed(1)}%</td>
                                        <td className="text-right text-slate-400 font-medium text-[12px]">{c.savedAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── REPORT PREVIEW MODAL ── */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay"
                        onClick={e => e.target === e.currentTarget && setShowPreview(false)}>
                        <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="modal-box" style={{ maxWidth: 660 }}>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <div>
                                    <h2 className="text-[16px] font-black text-slate-900">Report Preview</h2>
                                    <p className="label mt-0.5">{config.type} · {config.period}</p>
                                </div>
                                <button onClick={() => setShowPreview(false)} className="icon-btn"><X size={16} /></button>
                            </div>

                            {/* Preview content */}
                            <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                                {/* Report header */}
                                <div className="p-5 rounded-2xl mb-5 flex items-center justify-between"
                                    style={{ background: '#0F172A' }}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white font-black text-[10px]"
                                                style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}>TP</div>
                                            <span className="text-white font-black text-[14px]">TaxPal</span>
                                        </div>
                                        <h3 className="text-white font-black text-[18px]">{config.type}</h3>
                                        <p className="text-slate-500 text-[12px] font-medium mt-0.5">Period: {config.period} · Generated {fmtDate()}</p>
                                    </div>
                                    <span className="badge badge-accent">Preview</span>
                                </div>

                                {/* Summary metrics */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                                    {[
                                        { label: 'Total Revenue', val: fmt(totalIn), color: 'var(--income)' },
                                        { label: 'Total Expenses', val: fmt(totalOut), color: 'var(--expense)' },
                                        { label: 'Net Earnings', val: fmt(summary.netEarnings), color: summary.netEarnings >= 0 ? 'var(--income)' : 'var(--expense)' },
                                        { label: 'Estimated Tax', val: fmt(summary.estTax), color: 'var(--warning)' },
                                        { label: 'Profit Margin', val: `${profitMargin}%`, color: 'var(--accent)' },
                                        { label: 'Tax Efficiency', val: `${taxEff}%`, color: 'var(--income)' },
                                    ].map(item => (
                                        <div key={item.label} className="p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                                            <p className="label mb-1.5">{item.label}</p>
                                            <p className="text-[17px] font-black" style={{ color: item.color }}>{item.val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Category breakdown preview */}
                                {catBreakdown.length > 0 && (
                                    <div className="mb-5">
                                        <p className="label mb-3">Spending by Category</p>
                                        <div className="space-y-2.5">
                                            {catBreakdown.slice(0, 5).map(({ cat, amt, pct }) => (
                                                <div key={cat} className="flex items-center gap-3">
                                                    <span className="text-[11px] font-bold text-slate-600 w-28 shrink-0 truncate">{cat}</span>
                                                    <div className="flex-1 progress-track" style={{ height: 5 }}>
                                                        <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
                                                    </div>
                                                    <span className="text-[12px] font-black text-slate-900 w-20 text-right shrink-0">{fmt(amt)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recent transactions preview */}
                                <div>
                                    <p className="label mb-3">Recent Transactions</p>
                                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #F1F5F9' }}>
                                        {transactions.slice(0, 5).map((t, i) => (
                                            <div key={t.id} className="flex items-center justify-between px-4 py-3"
                                                style={{ borderBottom: i < 4 ? '1px solid #F8FAFC' : 'none' }}>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                                        style={{ background: t.group === 'INCOME' ? 'var(--income-light)' : 'var(--expense-light)', color: t.group === 'INCOME' ? 'var(--income)' : 'var(--expense)' }}>
                                                        {t.group === 'INCOME' ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] font-bold text-slate-900">{t.label}</p>
                                                        <p className="text-[10px] text-slate-400">{t.date}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[13px] font-black" style={{ color: t.group === 'INCOME' ? 'var(--income)' : '#0F172A' }}>
                                                    {t.group === 'INCOME' ? '+' : '-'}{fmt(t.flow)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid #F1F5F9' }}>
                                <button onClick={() => setShowPreview(false)} className="btn-secondary flex-1">Close Preview</button>
                                <button onClick={() => { handleGenerate(); setShowPreview(false); }} className="btn-primary flex-1">
                                    <Download size={14} /> Download {config.format.split(' ')[0]}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}

const MetricCard = ({ icon, label, value, color }) => {
    const bg = { income: 'var(--income-light)', accent: 'var(--accent-light)', warning: 'var(--warning-light)' };
    const text = { income: 'var(--income)', accent: 'var(--accent)', warning: 'var(--warning)' };
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} className="card p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg[color], color: text[color] }}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <div>
                <p className="label mb-1">{label}</p>
                <p className="text-[20px] font-black tracking-tight text-slate-900">{value}</p>
            </div>
        </motion.div>
    );
};

const Field = ({ label, children }) => (
    <div>
        <label className="label mb-1.5 block">{label}</label>
        {children}
    </div>
);
