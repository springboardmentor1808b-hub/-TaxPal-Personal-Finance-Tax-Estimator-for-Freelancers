import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Search, ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  const { transactions, summary } = useAppContext();
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState('Month');
  const [search, setSearch] = useState('');

  // Chart data (last 6 months mock + live May)
  const chartData = [
    { month: 'Jan', income: 7800, expense: 3200 },
    { month: 'Feb', income: 6900, expense: 3500 },
    { month: 'Mar', income: 9100, expense: 4100 },
    { month: 'Apr', income: 7400, expense: 3890 },
    { month: 'May', income: summary.totalIncome, expense: summary.totalExpenses },
    { month: 'Jun', income: 0, expense: 0 },
  ];
  const maxVal = Math.max(...chartData.map(d => Math.max(d.income, d.expense)), 1);

  const pieData = [
    { name: 'Rent/Mortgage', pct: 32, color: '#6366F1' },
    { name: 'Business Expenses', pct: 28, color: '#10B981' },
    { name: 'Utilities', pct: 15, color: '#F59E0B' },
    { name: 'Food', pct: 12, color: '#F43F5E' },
    { name: 'Other', pct: 13, color: '#94A3B8' },
  ];

  const filtered = transactions.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 6);

  const savingsRate = summary.totalIncome > 0
    ? ((summary.netEarnings / summary.totalIncome) * 100).toFixed(1)
    : '0.0';

  return (
    <DashboardLayout>
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-0.5">Financial Overview</h1>
          <p className="label">Financial pulse · May 2025</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Download size={14} /> Export
          </button>
          <button className="btn-primary" onClick={() => navigate('/transactions')}>
            <Plus size={14} /> New Entry
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Monthly Income" value={fmt(summary.totalIncome)} delta="+12%" positive trend={`+${12}% from last month`} color="income" />
        <KpiCard label="Monthly Expenses" value={fmt(summary.totalExpenses)} delta="-8%" positive={false} trend="-8% from last month" color="expense" />
        <KpiCard label="Estimated Tax Due" value={fmt(summary.estTax)} delta="Q2 due Jun 16" trend="No upcoming taxes" color="warning" />
        <KpiCard label="Savings Rate" value={`${savingsRate}%`} delta="+3.2%" positive trend="+3.2% from your goal" color="accent" />
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        {/* Bar chart */}
        <div className="xl:col-span-2 card p-7">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[17px] font-black text-slate-900 italic">Income vs Expenses</h3>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#F1F5F9' }}>
              {['Year', 'Quarter', 'Month'].map(p => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                  style={{
                    background: chartPeriod === p ? 'white' : 'transparent',
                    color: chartPeriod === p ? '#0F172A' : '#94A3B8',
                    boxShadow: chartPeriod === p ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          {/* Bars */}
          <div className="flex items-end gap-2 h-44 pb-2" style={{ borderBottom: '1px solid #F1F5F9' }}>
            {chartData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center gap-0.5 h-36">
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${(d.income / maxVal) * 144}px` }}
                    transition={{ duration: 0.7, delay: i * 0.06 }}
                    className="flex-1 rounded-t-md"
                    style={{ background: 'var(--income)', maxWidth: 14 }}
                  />
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${(d.expense / maxVal) * 144}px` }}
                    transition={{ duration: 0.7, delay: i * 0.06 + 0.1 }}
                    className="flex-1 rounded-t-md"
                    style={{ background: 'var(--expense)', maxWidth: 14 }}
                  />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-6 justify-center mt-4">
            {[{ label: 'Income', color: 'var(--income)' }, { label: 'Expenses', color: 'var(--expense)' }].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="card p-5 sm:p-7 flex flex-col">
          <h3 className="text-[17px] font-black text-slate-900 mb-6 italic">Expense Breakdown</h3>
          <DonutChart data={pieData} total={summary.totalExpenses} />
          <div className="mt-5 space-y-2.5">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: item.color }} />
                  <span className="text-[12px] font-semibold text-slate-600">{item.name}</span>
                </div>
                <span className="text-[12px] font-black text-slate-900">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRANSACTIONS TABLE ── */}
      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div>
            <h3 className="text-[17px] font-black text-slate-900 italic">Recent Transactions</h3>
            <p className="label mt-0.5">Transaction History</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all outline-none"
              style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A', width: 220 }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'white'; }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table min-w-[480px]">
            <thead>
              <tr>
                <th className="text-left">Description</th>
                <th className="text-left">Category</th>
                <th className="text-left">Date</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0"
                        style={{ background: t.group === 'INCOME' ? 'var(--income)' : '#E2E8F0', color: t.group === 'INCOME' ? 'white' : '#64748B' }}>
                        {t.group === 'INCOME' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">{t.label}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-neutral">{t.category}</span></td>
                  <td><span className="text-[12px] font-semibold text-slate-400">{t.date}</span></td>
                  <td className="text-right">
                    <span className="text-[14px] font-black" style={{ color: t.group === 'INCOME' ? 'var(--income)' : '#0F172A' }}>
                      {t.group === 'INCOME' ? '+' : '-'}{fmt(t.flow)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={`badge ${t.group === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                      {t.group === 'INCOME' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5" style={{ borderTop: '1px solid #F1F5F9', background: '#FAFBFC' }}>
          <button onClick={() => navigate('/transactions')} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
            View all transactions →
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, trend, positive, color }) {
  const colors = {
    income: { bg: 'var(--income-light)', text: 'var(--income)', icon: '#10B981' },
    expense: { bg: 'var(--expense-light)', text: 'var(--expense)', icon: '#F43F5E' },
    warning: { bg: 'var(--warning-light)', text: 'var(--warning)', icon: '#F59E0B' },
    accent: { bg: 'var(--accent-light)', text: 'var(--accent)', icon: '#6366F1' },
  };
  const c = colors[color] ?? colors.accent;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="card p-6 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: c.bg }}>
          <div className="w-3 h-3 rounded-sm" style={{ background: c.icon }} />
        </div>
        <span className="label text-right leading-snug max-w-[100px] text-right">{label}</span>
      </div>
      <p className="text-[26px] font-black tracking-tight text-slate-900 leading-none mb-2">{value}</p>
      <p className="text-[11px] font-semibold" style={{ color: positive === true ? 'var(--income)' : positive === false ? 'var(--expense)' : '#94A3B8' }}>
        {positive === true ? '↑ ' : positive === false ? '↓ ' : '– '}{trend}
      </p>
    </motion.div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart({ data, total }) {
  const fmt2 = n => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
  let cum = 0;
  const polarToXY = (cx, cy, r, pct) => {
    const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };
  return (
    <div className="flex justify-center">
      <div className="relative" style={{ width: 152, height: 152 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {data.map((d) => {
            const start = cum;
            cum += d.pct;
            const s = polarToXY(50, 50, 40, start);
            const e = polarToXY(50, 50, 40, cum);
            const large = d.pct > 50 ? 1 : 0;
            const path = `M50 50 L${s.x} ${s.y} A40 40 0 ${large} 1 ${e.x} ${e.y} Z`;
            return <path key={d.name} d={path} fill={d.color} className="hover:opacity-80 transition-opacity" />;
          })}
          <circle cx="50" cy="50" r="26" fill="white" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[15px] font-black text-slate-900">{fmt2(total)}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</span>
        </div>
      </div>
    </div>
  );
}