import { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { useTransactions } from "../context/TransactionContext";
import { api } from "../utils/api";

/* ─── helpers ─────────────────────────────────────────────────────── */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const QUARTERS = [
  { value: "Q1", label: "Q1 — Jan · Feb · Mar", months: [0,1,2] },
  { value: "Q2", label: "Q2 — Apr · May · Jun", months: [3,4,5] },
  { value: "Q3", label: "Q3 — Jul · Aug · Sep", months: [6,7,8] },
  { value: "Q4", label: "Q4 — Oct · Nov · Dec", months: [9,10,11] },
];

function groupByMonth(txs) {
  const map = {};
  txs.forEach(tx => {
    const d   = new Date(tx.date);
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
    if (tx.type === "income")  map[key].income  += Number(tx.amount);
    else                       map[key].expense += Number(tx.amount);
  });
  return Object.values(map);
}

function groupByQuarter(txs) {
  const map = {};
  txs.forEach(tx => {
    const d   = new Date(tx.date);
    const q   = Math.ceil((d.getMonth() + 1) / 3);
    const key = `Q${q} ${d.getFullYear()}`;
    if (!map[key]) map[key] = { quarter: key, income: 0, expense: 0 };
    if (tx.type === "income")  map[key].income  += Number(tx.amount);
    else                       map[key].expense += Number(tx.amount);
  });
  return Object.values(map);
}

/* ─── CSV download ────────────────────────────────────────────────── */
function downloadCSV(rows, headers, filename) {
  const lines = [headers.join(","), ...rows.map(r => headers.map(h => r[h] ?? "").join(","))];
  const blob  = new Blob([lines.join("\n")], { type: "text/csv" });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement("a");
  a.href      = url;
  a.download  = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Stat pill ───────────────────────────────────────────────────── */
function Pill({ label, value, gradient }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 border border-purple-100 shadow-sm flex flex-col gap-1">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className={`text-2xl font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{value}</p>
    </div>
  );
}

const inputCls = "bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all";

/* ─── Quarter Dropdown ────────────────────────────────────────────── */
function QuarterDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "all", label: "All Quarters (Full Year)", icon: "📅" },
    ...QUARTERS.map(q => ({ value: q.value, label: q.label, icon: "📊" })),
  ];

  const selected = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Quarter</p>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all min-w-[220px] justify-between
          ${disabled
            ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
            : "bg-purple-50 border-purple-200 text-gray-700 hover:border-purple-400 hover:bg-purple-100"
          }`}
      >
        <span className="flex items-center gap-2">
          <span>{selected.icon}</span>
          <span>{selected.label}</span>
        </span>
        <svg className={`w-4 h-4 text-purple-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-2 left-0 bg-white rounded-2xl border border-purple-100 shadow-xl overflow-hidden min-w-[240px] animate-[fadeSlideUp_0.15s_ease-out]">
            {options.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors
                  ${i < options.length - 1 ? "border-b border-purple-50" : ""}
                  ${opt.value === value
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 font-bold"
                    : "text-gray-600 hover:bg-purple-50 font-medium"
                  }`}
              >
                <span className="text-base">{opt.icon}</span>
                <span>{opt.label}</span>
                {opt.value === value && (
                  <span className="ml-auto text-purple-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function Reports() {
  const { transactions, fmt, currency } = useTransactions();

  const [reportType, setReportType] = useState("income-summary");
  const [period,     setPeriod]     = useState("monthly");
  const [quarter,    setQuarter]    = useState("all");   // "all" | "Q1" | "Q2" | "Q3" | "Q4"
  const [year,       setYear]       = useState(new Date().getFullYear());
  const [generated,  setGenerated]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const previewRef = useRef(null);

  /* ── filter txs by year (and optionally quarter) ── */
  const yearTxs = transactions.filter(tx => new Date(tx.date).getFullYear() === Number(year));

  const filteredTxs = (() => {
    if (period !== "quarterly" || quarter === "all") return yearTxs;
    const qDef = QUARTERS.find(q => q.value === quarter);
    if (!qDef) return yearTxs;
    return yearTxs.filter(tx => qDef.months.includes(new Date(tx.date).getMonth()));
  })();

  /* ── compute stats from filteredTxs ── */
  const income  = filteredTxs.filter(t => t.type === "income").reduce((s,t)  => s + Number(t.amount), 0);
  const expense = filteredTxs.filter(t => t.type === "expense").reduce((s,t) => s + Number(t.amount), 0);
  const savings = income - expense;
  const tax     = Math.round(income * 0.25);

  const monthlyData   = groupByMonth(filteredTxs);
  const quarterlyData = groupByQuarter(yearTxs); // always full-year for quarterly breakdown

  /* ── period label for display ── */
  const periodLabel = (() => {
    if (period === "quarterly" && quarter !== "all") return `${quarter} ${year}`;
    if (period === "yearly") return `Full Year ${year}`;
    return `Year ${year}`;
  })();

  const REPORT_TYPES = [
    { value: "income-summary",      label: "Income Summary",      icon: "📈" },
    { value: "expense-summary",     label: "Expense Summary",     icon: "💸" },
    { value: "tax-report",          label: "Tax Report",          icon: "🧾" },
    { value: "quarterly-breakdown", label: "Quarterly Breakdown", icon: "📊" },
  ];

  /* ── generate ── */
  const handleGenerate = async () => {
    setGenerated(true);
    try {
      setSaving(true);
      await api("/api/reports/save", {
        method: "POST",
        body: JSON.stringify({
          report_type: reportType,
          period:      `${period}-${year}${period === "quarterly" && quarter !== "all" ? `-${quarter}` : ""}`,
          format:      "preview",
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  /* ── CSV export ── */
  const handleCSV = () => {
    const suffix = period === "quarterly" && quarter !== "all" ? `${quarter}-${year}` : year;

    if (reportType === "income-summary") {
      const rows = filteredTxs.filter(t => t.type === "income").map(t => ({
        Date: t.date, Category: t.category, Description: t.description, Amount: t.amount,
      }));
      downloadCSV(rows, ["Date","Category","Description","Amount"], `income-${suffix}.csv`);
    } else if (reportType === "expense-summary") {
      const rows = filteredTxs.filter(t => t.type === "expense").map(t => ({
        Date: t.date, Category: t.category, Description: t.description, Amount: t.amount,
      }));
      downloadCSV(rows, ["Date","Category","Description","Amount"], `expense-${suffix}.csv`);
    } else if (reportType === "quarterly-breakdown") {
      downloadCSV(quarterlyData, ["quarter","income","expense"], `quarterly-${year}.csv`);
    } else if (reportType === "tax-report") {
      downloadCSV(
        [{ Period: periodLabel, TotalIncome: income, TotalExpense: expense, NetSavings: savings, EstimatedTax: tax }],
        ["Period","TotalIncome","TotalExpense","NetSavings","EstimatedTax"],
        `tax-report-${suffix}.csv`
      );
    }
  };

  /* ── preview content ── */
  const renderPreview = () => {
    const title = REPORT_TYPES.find(r => r.value === reportType)?.label;

    if (reportType === "income-summary") {
      const rows = filteredTxs.filter(t => t.type === "income");
      return (
        <>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 mb-1">{title}</h1>
              <p className="text-xs text-gray-400">{periodLabel} · {rows.length} transactions</p>
            </div>
            {period === "quarterly" && quarter !== "all" && (
              <span className="px-3 py-1.5 text-xs font-bold bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                {quarter} {year}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Pill label="Total Income"  value={fmt(income)}  gradient="from-purple-600 to-pink-600" />
            <Pill label="Transactions"  value={rows.length}  gradient="from-blue-600 to-purple-600" />
          </div>
          <table className="w-full text-sm">
            <thead className="bg-purple-50">
              <tr>{["Date","Category","Description","Amount"].map(h =>
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-purple-400 uppercase tracking-widest">{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {rows.map((t,i) => (
                <tr key={i} className="border-b border-purple-50 hover:bg-purple-50/40">
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{t.date}</td>
                  <td className="px-4 py-2.5 text-gray-700">{t.category}</td>
                  <td className="px-4 py-2.5 text-gray-500 truncate max-w-xs">{t.description || "—"}</td>
                  <td className="px-4 py-2.5 font-bold text-emerald-600">{fmt(t.amount)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-gray-300 text-sm">No income records for {periodLabel}</td></tr>
              )}
            </tbody>
          </table>
        </>
      );
    }

    if (reportType === "expense-summary") {
      const rows = filteredTxs.filter(t => t.type === "expense");
      return (
        <>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 mb-1">{title}</h1>
              <p className="text-xs text-gray-400">{periodLabel} · {rows.length} transactions</p>
            </div>
            {period === "quarterly" && quarter !== "all" && (
              <span className="px-3 py-1.5 text-xs font-bold bg-pink-100 text-pink-700 rounded-full border border-pink-200">
                {quarter} {year}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Pill label="Total Expenses" value={fmt(expense)} gradient="from-pink-600 to-rose-500" />
            <Pill label="Transactions"   value={rows.length}  gradient="from-blue-600 to-purple-600" />
          </div>
          <table className="w-full text-sm">
            <thead className="bg-purple-50">
              <tr>{["Date","Category","Description","Amount"].map(h =>
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-purple-400 uppercase tracking-widest">{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {rows.map((t,i) => (
                <tr key={i} className="border-b border-purple-50 hover:bg-purple-50/40">
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{t.date}</td>
                  <td className="px-4 py-2.5 text-gray-700">{t.category}</td>
                  <td className="px-4 py-2.5 text-gray-500 truncate max-w-xs">{t.description || "—"}</td>
                  <td className="px-4 py-2.5 font-bold text-rose-500">{fmt(t.amount)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-gray-300 text-sm">No expense records for {periodLabel}</td></tr>
              )}
            </tbody>
          </table>
        </>
      );
    }

    if (reportType === "tax-report") {
      return (
        <>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 mb-1">{title}</h1>
              <p className="text-xs text-gray-400">{periodLabel} · 25% flat estimation</p>
            </div>
            {period === "quarterly" && quarter !== "all" && (
              <span className="px-3 py-1.5 text-xs font-bold bg-orange-100 text-orange-700 rounded-full border border-orange-200">
                {quarter} {year}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Pill label="Total Income"   value={fmt(income)}              gradient="from-purple-600 to-pink-600" />
            <Pill label="Total Expense"  value={fmt(expense)}             gradient="from-pink-600 to-rose-500" />
            <Pill label="Net Savings"    value={fmt(Math.max(0,savings))} gradient="from-emerald-500 to-teal-500" />
            <Pill label="Est. Tax (25%)" value={fmt(tax)}                 gradient="from-orange-500 to-amber-500" />
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Tax Breakdown</p>
            {[
              { label: "Gross Income",         val: fmt(income),              color: "text-purple-700" },
              { label: "Total Deductible Exp.", val: fmt(expense),             color: "text-rose-500" },
              { label: "Net Taxable Income",    val: fmt(Math.max(0,savings)), color: "text-gray-800" },
              { label: "Estimated Tax",         val: fmt(tax),                 color: "text-blue-600 font-extrabold text-base" },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-sm py-2 border-b border-purple-100 last:border-0">
                <span className="text-gray-500">{r.label}</span>
                <span className={`font-bold ${r.color}`}>{r.val}</span>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (reportType === "quarterly-breakdown") {
      return (
        <>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 mb-1">{title}</h1>
              <p className="text-xs text-gray-400">Full Year {year} · all four quarters</p>
            </div>
            <span className="px-3 py-1.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full border border-blue-200">
              {year} Overview
            </span>
          </div>

          {/* Summary pills across all quarters */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <Pill label="Total Income"  value={fmt(quarterlyData.reduce((s,r) => s + r.income, 0))}  gradient="from-purple-600 to-pink-600" />
            <Pill label="Total Expense" value={fmt(quarterlyData.reduce((s,r) => s + r.expense, 0))} gradient="from-pink-600 to-rose-500" />
            <Pill label="Net Savings"   value={fmt(quarterlyData.reduce((s,r) => s + (r.income - r.expense), 0))} gradient="from-emerald-500 to-teal-500" />
          </div>

          <table className="w-full text-sm">
            <thead className="bg-purple-50">
              <tr>{["Quarter","Months","Income","Expense","Net","Est. Tax"].map(h =>
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-purple-400 uppercase tracking-widest">{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {QUARTERS.map((qDef, i) => {
                const row = quarterlyData.find(r => r.quarter.startsWith(qDef.value)) || { income: 0, expense: 0 };
                const net = row.income - row.expense;
                const qt  = Math.round(row.income * 0.25);
                return (
                  <tr key={qDef.value} className="border-b border-purple-50 hover:bg-purple-50/40">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                        {qDef.value}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {MONTHS[qDef.months[0]]} – {MONTHS[qDef.months[2]]}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{fmt(row.income)}</td>
                    <td className="px-4 py-3 font-bold text-rose-500">{fmt(row.expense)}</td>
                    <td className={`px-4 py-3 font-bold ${net >= 0 ? "text-blue-600" : "text-rose-600"}`}>{fmt(net)}</td>
                    <td className="px-4 py-3 font-bold text-orange-500">{fmt(qt)}</td>
                  </tr>
                );
              })}
              {quarterlyData.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-300 text-sm">No data for {year}</td></tr>
              )}
            </tbody>
          </table>
        </>
      );
    }
  };

  /* ══════════════════════════ RENDER ════════════════════════════════ */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Reports
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Generate and download monthly, quarterly, or yearly financial reports.
          </p>
        </div>

        {/* Controls card */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-5">Generate Report</h2>

          {/* Report type selector */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Report Type</p>
            <div className="flex flex-wrap gap-2">
              {REPORT_TYPES.map((r) => (
                <button key={r.value} onClick={() => { setReportType(r.value); setGenerated(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    reportType === r.value
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow"
                      : "bg-purple-50 text-gray-500 border-purple-100 hover:text-purple-600 hover:border-purple-300"
                  }`}>
                  <span>{r.icon}</span> {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Period + Quarter + Year filters */}
          <div className="flex flex-wrap items-end gap-4">

            {/* Period */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Period</p>
              <div className="flex gap-2">
                {["monthly","quarterly","yearly"].map(p => (
                  <button key={p} onClick={() => { setPeriod(p); setGenerated(false); if (p !== "quarterly") setQuarter("all"); }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      period === p
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow"
                        : "bg-purple-50 text-gray-500 border-purple-100 hover:text-purple-600"
                    }`}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quarter dropdown — only visible when period = quarterly */}
            {period === "quarterly" && (
              <QuarterDropdown
                value={quarter}
                onChange={(v) => { setQuarter(v); setGenerated(false); }}
                disabled={false}
              />
            )}

            {/* Year */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Year</p>
              <select value={year} onChange={e => { setYear(e.target.value); setGenerated(false); }}
                className={inputCls}>
                {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Active filter badge */}
            {generated && (
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-600">
                <span>🎯</span>
                <span>{periodLabel}</span>
              </div>
            )}

            <button onClick={handleGenerate} disabled={saving}
              className="ml-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all disabled:opacity-60">
              {saving ? "Saving…" : "Generate Report"}
            </button>
          </div>

          {/* Quarterly hint */}
          {period === "quarterly" && (
            <p className="mt-4 text-xs text-gray-400 bg-purple-50 rounded-xl px-4 py-2.5 border border-purple-100">
              💡 Select a specific quarter (Q1–Q4) to filter data for just those 3 months, or choose{" "}
              <span className="font-semibold text-purple-600">All Quarters</span> to see the full year broken down by quarter.
            </p>
          )}
        </div>

        {/* Report Preview */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">

          {/* Preview toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-50">
            <h2 className="text-sm font-semibold text-gray-500">Report Preview</h2>
            {generated && (
              <div className="flex gap-2">
                <button onClick={handleCSV}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow hover:shadow-purple-200 transition-all">
                  ⬇ Download CSV
                </button>
              </div>
            )}
          </div>

          {/* Preview body */}
          <div className="p-6" ref={previewRef}>
            {!generated ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                <div className="text-6xl mb-4 opacity-40">📄</div>
                <p className="text-base text-gray-400 font-medium">Select a report to preview</p>
                <p className="text-sm text-gray-300 mt-1">
                  Generated reports will appear here for review before downloading
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {renderPreview()}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}