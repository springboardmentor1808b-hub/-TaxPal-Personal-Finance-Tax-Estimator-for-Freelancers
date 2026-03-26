import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useTransactions } from "../context/TransactionContext";
import { api } from "../utils/api";

const inputCls =
  "w-full bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-gray-300";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Tax deadline config (month is 0-indexed) ──────────────────────── */
const QUARTER_DEADLINES = {
  "Q1": { label: "Q1 (Jan–Mar)", due: { month: 3,  day: 15 } }, // Apr 15
  "Q2": { label: "Q2 (Apr–Jun)", due: { month: 5,  day: 15 } }, // Jun 15
  "Q3": { label: "Q3 (Jul–Sep)", due: { month: 8,  day: 15 } }, // Sep 15
  "Q4": { label: "Q4 (Oct–Dec)", due: { month: 0,  day: 15, nextYear: true } }, // Jan 15 next year
};

function getDueDate(qKey, year) {
  const { due } = QUARTER_DEADLINES[qKey];
  const y = due.nextYear ? year + 1 : year;
  return new Date(y, due.month, due.day);
}

function daysUntil(date) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((date - now) / (1000 * 60 * 60 * 24));
}

function getTaxPaymentsByQuarter(transactions, targetYear) {
  const base = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
  transactions
    .filter((t) => t.category === 'Tax Payment')
    .filter((t) => new Date(t.date).getFullYear() === Number(targetYear))
    .forEach((tx) => {
      const match = String(tx.description || '').match(/Q[1-4]/i);
      if (match && base[match[0].toUpperCase()] !== undefined) {
        base[match[0].toUpperCase()] += Number(tx.amount || 0);
      }
    });
  return base;
}

/* ── Core tax math ──────────────────────────────────────────────────── */
function computeAnnualTax({ country, annualTaxable }) {
  if (country === "india") {
    if (annualTaxable <= 300000)       return 0;
    if (annualTaxable <= 700000)       return 0.05 * (annualTaxable - 300000);
    if (annualTaxable <= 1000000)      return 0.10 * (annualTaxable - 700000) + 20000;
    return                                    0.15 * (annualTaxable - 1000000) + 50000;
  }
  // USA: self-employment (15.3%) + income tax (~12%)
  return annualTaxable * (0.153 + 0.12);
}

/* ── Deadline Alert Banner ──────────────────────────────────────────── */
function DeadlineAlerts({ quarters, year }) {
  const alerts = [];
  quarters.forEach((q) => {
    if (q.fullyPaid) return;
    const due  = getDueDate(q.key, year);
    const days = daysUntil(due);
    if (days <= 30 && days >= -7) {
      alerts.push({ ...q, due, days });
    }
  });

  if (alerts.length === 0) return null;

  return (
    <div className="mb-6 space-y-2">
      {alerts.map((a) => {
        const overdue = a.days < 0;
        const urgent  = a.days <= 7 && a.days >= 0;
        return (
          <div key={a.key}
            className={`flex items-start gap-3 rounded-2xl px-5 py-3.5 border ${
              overdue ? "bg-rose-50 border-rose-200"
              : urgent ? "bg-amber-50 border-amber-200"
              : "bg-blue-50 border-blue-200"
            }`}>
            <span className="text-xl mt-0.5">{overdue ? "🚨" : urgent ? "⚠️" : "🔔"}</span>
            <div>
              <p className={`text-sm font-bold ${
                overdue ? "text-rose-700" : urgent ? "text-amber-700" : "text-blue-700"
              }`}>
                {overdue
                  ? `${a.label} tax is OVERDUE by ${Math.abs(a.days)} day${Math.abs(a.days) !== 1 ? "s" : ""}!`
                  : urgent
                  ? `${a.label} tax due in ${a.days} day${a.days !== 1 ? "s" : ""}!`
                  : `${a.label} tax due in ${a.days} days`
                }
              </p>
              <p className={`text-xs mt-0.5 ${
                overdue ? "text-rose-500" : urgent ? "text-amber-600" : "text-blue-500"
              }`}>
                Due {a.due.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                {" · "}Remaining balance:{" "}
                <span className="font-bold">
                  {a.remaining > 0
                    ? `${a.currency}${a.remaining.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
                    : "Paid ✓"}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Partial payment modal ──────────────────────────────────────────── */
function PayModal({ quarter, currency, onConfirm, onClose }) {
  const [amount, setAmount] = useState("");
  const max = quarter.remaining;

  const submit = () => {
    const paid = Math.min(Number(amount) || 0, max);
    if (paid <= 0) return;
    onConfirm(paid);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl border border-purple-100 w-full max-w-sm mx-4 overflow-hidden animate-[fadeSlideUp_0.2s_ease-out]">
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
        <div className="px-7 pt-6 pb-7">
          <h3 className="text-lg font-extrabold text-gray-900 mb-1">Record Payment</h3>
          <p className="text-sm text-gray-500 mb-5">
            {quarter.label} · Remaining:{" "}
            <span className="font-bold text-purple-600">
              {currency}{quarter.remaining.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
          </p>

          <Field label={`Amount Paid (${currency})`}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{currency}</span>
              <input
                type="number" min="0" max={max} placeholder="0.00"
                value={amount} onChange={(e) => setAmount(e.target.value)}
                className={`${inputCls} pl-8`}
                autoFocus
              />
            </div>
          </Field>

          <div className="flex gap-2 mt-2 mb-5">
            {[25, 50, 75, 100].map((pct) => (
              <button key={pct} type="button"
                onClick={() => setAmount(((max * pct) / 100).toFixed(2))}
                className="flex-1 text-xs py-1.5 rounded-lg bg-purple-50 text-purple-600 font-semibold border border-purple-100 hover:bg-purple-100 transition-all">
                {pct}%
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 border-2 border-gray-200 text-gray-500 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">
              Cancel
            </button>
            <button onClick={submit}
              className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow hover:shadow-purple-200 hover:-translate-y-0.5 transition-all text-sm">
              Confirm
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ── Quarter Card ───────────────────────────────────────────────────── */
function QuarterCard({ q, year, currency, fmt, onPay }) {
  const due   = getDueDate(q.key, year);
  const days  = daysUntil(due);
  const pct   = q.totalDue > 0 ? Math.min((q.totalPaid / q.totalDue) * 100, 100) : 0;

  const statusColor = q.fullyPaid
    ? "from-emerald-500 to-teal-400"
    : pct > 0
    ? "from-amber-400 to-orange-400"
    : "from-purple-500 to-pink-500";

  const dueLabel = days < 0
    ? <span className="text-rose-600 font-bold">Overdue {Math.abs(days)}d</span>
    : days <= 7
    ? <span className="text-amber-600 font-bold">Due in {days}d</span>
    : <span className="text-gray-400">Due {due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>;

  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
      q.fullyPaid ? "border-emerald-200" : "border-purple-100"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{q.key}</p>
          <p className="font-bold text-gray-800 text-base">{q.label.replace(/Q\d\s/, "")}</p>
          <p className="text-xs mt-0.5">{dueLabel}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          q.fullyPaid ? "bg-emerald-100 text-emerald-700"
          : pct > 0   ? "bg-amber-100 text-amber-700"
          : "bg-purple-100 text-purple-700"
        }`}>
          {q.fullyPaid ? "✓ Paid" : pct > 0 ? "Partial" : "Unpaid"}
        </span>
      </div>

      {/* Carry-forward note */}
      {q.carryIn > 0 && (
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mb-3 text-xs text-amber-700 font-medium">
          <span>↩</span>
          <span>Includes {fmt(q.carryIn)} carried from {q.prevKey}</span>
        </div>
      )}

      {/* Amounts */}
      <div className="space-y-1 mb-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Base quarter</span>
          <span className="text-gray-700 font-medium">{fmt(q.baseAmount)}</span>
        </div>
        {q.carryIn > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Carry-forward</span>
            <span className="text-amber-600 font-medium">+{fmt(q.carryIn)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-purple-50 pt-1 font-semibold">
          <span className="text-gray-600">Total Due</span>
          <span className="text-gray-900">{fmt(q.totalDue)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Paid</span>
          <span className="text-emerald-600 font-semibold">{fmt(q.totalPaid)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Remaining</span>
          <span className={q.remaining > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-semibold"}>
            {fmt(q.remaining)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
        <div className={`h-2 rounded-full bg-gradient-to-r ${statusColor} transition-all duration-700`}
          style={{ width: `${pct}%` }} />
      </div>

      {/* Pay button */}
      {!q.fullyPaid && (
        <button onClick={() => onPay(q)}
          className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-bold rounded-xl shadow hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">
          Record Payment
        </button>
      )}
      {q.fullyPaid && (
        <div className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-xl text-center">
          ✓ Fully Paid
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════ */
export default function TaxEstimator() {
  const { transactions, addTransaction } = useTransactions();
  const [taxHistory, setTaxHistory] = useState([]);
  const [form, setForm] = useState({
    country:          "usa",
    state:            "",
    filingStatus:     "single",
    year:             new Date().getFullYear(),
    grossIncome:      "",
    businessExpenses: "",
    retirement:       "",
    healthInsurance:  "",
    homeOffice:       "",
  });

  // quarters: array of { key, label, baseAmount, carryIn, totalDue, totalPaid, remaining, fullyPaid }
  const [quarters, setQuarters] = useState(null);
  const [calculated, setCalculated] = useState(false);
  const [payModal, setPayModal] = useState(null); // quarter object

  const currency = form.country === "india" ? "₹" : "$";
  const fmt = (n) =>
    `${currency}${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ── Recalculate & build quarters ── */
  const calculateTax = async (e) => {
    e.preventDefault();

    const income     = Number(form.grossIncome       || 0);
    const deductions = Number(form.businessExpenses  || 0)
                     + Number(form.retirement        || 0)
                     + Number(form.healthInsurance   || 0)
                     + Number(form.homeOffice        || 0);
    const taxable    = Math.max(income - deductions, 0);
    const annualTax  = computeAnnualTax({ country: form.country, annualTaxable: taxable });
    const perQ       = annualTax / 4;

    const qKeys = ["Q1", "Q2", "Q3", "Q4"];

    // If already calculated, preserve payments but rebuild amounts
    const prevQuarters = quarters || [];
    const paidByQuarter = getTaxPaymentsByQuarter(transactions, form.year);

    const newQuarters = qKeys.map((key, i) => {
      const prev = prevQuarters.find((q) => q.key === key);
      const persistedPaid = paidByQuarter[key] || 0;
      const totalPaid = Math.max(prev?.totalPaid || 0, persistedPaid);
      return {
        key,
        label:      QUARTER_DEADLINES[key].label,
        baseAmount: perQ,
        carryIn:    0,       // will be filled in next pass
        totalDue:   perQ,   // will be filled in next pass
        totalPaid,
        remaining:  0,       // computed below
        fullyPaid:  false,
        prevKey:    i > 0 ? qKeys[i - 1] : null,
        currency,
      };
    });

    // Forward-pass: carry unpaid amounts into next quarter
    for (let i = 0; i < newQuarters.length; i++) {
      const q = newQuarters[i];
      const carry = i > 0 ? Math.max(newQuarters[i - 1].remaining, 0) : 0;
      q.carryIn  = carry;
      q.totalDue = q.baseAmount + carry;
      q.remaining  = Math.max(q.totalDue - q.totalPaid, 0);
      q.fullyPaid  = q.remaining <= 0;
    }

    setQuarters(newQuarters);
    setCalculated(true);

    // Save to backend
    try {
      await api("/api/taxes/save", {
        method: "POST",
        body: JSON.stringify({
          country: form.country,
          state: form.state,
          filingStatus: form.filingStatus,
          year: Number(form.year),
          grossIncome: income,
          totalDeductions: deductions,
          taxableIncome: taxable,
          estimatedTax: annualTax,
          paidAmount: totalPaid,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Record a payment on a quarter ── */
  const handlePayConfirm = async (paid) => {
    const quarterKey = payModal?.key;

    setQuarters((prev) => {
      const updated = prev.map((q) => {
        if (q.key !== quarterKey) return q;
        const newPaid = q.totalPaid + paid;
        return { ...q, totalPaid: newPaid };
      });

      // Re-run carry-forward pass
      for (let i = 0; i < updated.length; i++) {
        const q = updated[i];
        const carry = i > 0 ? Math.max(updated[i - 1].remaining, 0) : 0;
        q.carryIn  = carry;
        q.totalDue = q.baseAmount + carry;
        q.remaining  = Math.max(q.totalDue - q.totalPaid, 0);
        q.fullyPaid  = q.remaining <= 0;
      }
      return [...updated];
    });

    // Persist tax payment as a transaction (reports + budgets can use this)
    try {
      await addTransaction({
        type: "expense",
        amount: paid,
        category: "Tax Payment",
        description: `Tax estimate ${quarterKey} payment`,
        date: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to save tax payment transaction:", err);
    }

    // Also save a small tax payment record to tax API for reconciliation
    try {
      await api("/api/taxes/payment", {
        method: "POST",
        body: JSON.stringify({
          quarter: quarterKey,
          amount: paid,
          year: Number(form.year),
          country: form.country,
          state: form.state,
          filingStatus: form.filingStatus,
        }),
      });
    } catch (err) {
      console.error("Failed to save tax payment record: ", err);
    }

    setPayModal(null);
  };

  /* ── Summary stats ── */
  const totalTax    = quarters ? quarters.reduce((s, q) => s + q.baseAmount, 0) : 0;
  const totalPaid   = quarters ? quarters.reduce((s, q) => s + q.totalPaid,  0) : 0;
  const totalRemain = quarters ? quarters.reduce((s, q) => s + Math.max(q.remaining, 0), 0) : 0;

  // Load historical saved tax estimates
  useEffect(() => {
    const fetchTaxHistory = async () => {
      try {
        const res = await api('/api/taxes');
        const data = await res.json();
        if (res.ok && Array.isArray(data.data)) {
          setTaxHistory(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch tax estimates:', err);
      }
    };
    fetchTaxHistory();
  }, []);

  /* ── Alert quarters (for deadline banners) ── */
  const alertQuarters = (quarters || []).map((q) => ({
    ...q,
    currency,
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Sidebar />

      {/* Payment Modal */}
      {payModal && (
        <PayModal
          quarter={payModal}
          currency={currency}
          onConfirm={handlePayConfirm}
          onClose={() => setPayModal(null)}
        />
      )}

      <div className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Tax Estimator
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Estimate your annual tax, track quarterly payments, and never miss a deadline.
          </p>
        </div>

        {/* Deadline alerts */}
        {calculated && (
          <DeadlineAlerts quarters={alertQuarters} year={Number(form.year)} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Input form ── */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-purple-100 shadow-sm h-fit">
            <h2 className="text-sm font-semibold text-gray-500 mb-4">Tax Calculator</h2>

            <form onSubmit={calculateTax} className="space-y-4">
              {/* Country / Year */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Country">
                  <select name="country" value={form.country} onChange={handleChange} className={inputCls}>
                    <option value="usa">United States</option>
                    <option value="india">India</option>
                  </select>
                </Field>
                <Field label="Tax Year">
                  <select name="year" value={form.year} onChange={handleChange} className={inputCls}>
                    {[2024, 2025, 2026].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="State / Province">
                  <input name="state" value={form.state} onChange={handleChange}
                    placeholder="e.g. California" className={inputCls} />
                </Field>
                <Field label="Filing Status">
                  <select name="filingStatus" value={form.filingStatus} onChange={handleChange} className={inputCls}>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </Field>
              </div>

              <Field label="Annual Gross Income">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{currency}</span>
                  <input type="number" name="grossIncome" min="0" placeholder="0.00"
                    value={form.grossIncome} onChange={handleChange} className={`${inputCls} pl-8`} />
                </div>
              </Field>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest pt-1">Deductions</p>
              {[
                { name: "businessExpenses", label: "Business Expenses" },
                { name: "retirement",       label: "Retirement" },
                { name: "healthInsurance",  label: "Health Insurance" },
                { name: "homeOffice",       label: "Home Office" },
              ].map((f) => (
                <Field key={f.name} label={f.label}>
                  <input type="number" name={f.name} min="0" placeholder="0.00"
                    value={form[f.name]} onChange={handleChange} className={inputCls} />
                </Field>
              ))}

              <button type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">
                {calculated ? "Recalculate" : "Calculate Tax"}
              </button>
            </form>
          </div>

          {/* ── RIGHT: Quarters + summary ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Summary banner */}
            {calculated && quarters && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Annual Tax",   val: fmt(totalTax),    color: "purple" },
                  { label: "Total Paid",   val: fmt(totalPaid),   color: "emerald" },
                  { label: "Outstanding",  val: fmt(totalRemain), color: "rose" },
                ].map((s) => (
                  <div key={s.label}
                    className={`bg-white rounded-2xl p-4 border shadow-sm text-center border-${s.color}-100`}>
                    <p className={`text-xs font-semibold text-${s.color}-400 uppercase tracking-widest mb-1`}>
                      {s.label}
                    </p>
                    <p className={`text-xl font-extrabold text-${s.color}-600`}>{s.val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Quarter cards */}
            {calculated && quarters ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quarters.map((q) => (
                  <QuarterCard
                    key={q.key}
                    q={q}
                    year={Number(form.year)}
                    currency={currency}
                    fmt={fmt}
                    onPay={setPayModal}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-purple-100 shadow-sm flex-1 flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-500 font-semibold text-lg">No tax data yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Fill in your income details and click Calculate Tax to see your quarterly breakdown.
                </p>
              </div>
            )}

            {/* Payment history log */}
            {calculated && quarters && (
              <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-widest">
                  Payment Tracker
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-purple-50">
                        {["Quarter", "Base", "Carry-In", "Total Due", "Paid", "Remaining", "Status"].map((h) => (
                          <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-purple-400 uppercase tracking-widest">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {quarters.map((q, i) => (
                        <tr key={q.key}
                          className={`${i < quarters.length - 1 ? "border-b border-purple-50" : ""} hover:bg-purple-50/50 transition-colors`}>
                          <td className="px-4 py-3 font-semibold text-gray-700">{q.key}</td>
                          <td className="px-4 py-3 text-gray-500">{fmt(q.baseAmount)}</td>
                          <td className="px-4 py-3">
                            {q.carryIn > 0
                              ? <span className="text-amber-600 font-medium">+{fmt(q.carryIn)}</span>
                              : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{fmt(q.totalDue)}</td>
                          <td className="px-4 py-3 text-emerald-600 font-semibold">{fmt(q.totalPaid)}</td>
                          <td className="px-4 py-3">
                            <span className={q.remaining > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-semibold"}>
                              {fmt(q.remaining)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              q.fullyPaid ? "bg-emerald-100 text-emerald-700"
                              : q.totalPaid > 0 ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-600"
                            }`}>
                              {q.fullyPaid ? "✓ Done" : q.totalPaid > 0 ? "Partial" : "Unpaid"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {taxHistory.length > 0 && (
              <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-widest">
                  Saved Tax Estimate History
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-purple-50">
                        {["Date", "Year", "Taxable", "Estimated", "Paid"].map((h) => (
                          <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-purple-400 uppercase tracking-widest">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {taxHistory.slice(0, 5).map((item) => (
                        <tr key={item._id || item.id} className="border-b border-purple-50">
                          <td className="px-4 py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{item.year}</td>
                          <td className="px-4 py-2">{fmt(item.taxableIncome)}</td>
                          <td className="px-4 py-2">{fmt(item.estimatedTax)}</td>
                          <td className="px-4 py-2">{fmt(item.paidAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}