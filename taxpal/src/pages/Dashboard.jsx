
// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useTransactions } from "../context/TransactionContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

/* ─── Helpers ─────────────────────────────────────────────────────── */
const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function getMonthlyData(txs) {
  const map = {};
  txs.forEach((tx) => {
    const key = new Date(tx.date).toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
    if (!map[key]) map[key] = { name: key, Income: 0, Expense: 0 };
    if (tx.type === "income") map[key].Income += Number(tx.amount);
    else map[key].Expense += Number(tx.amount);
  });
  return Object.values(map).slice(-6);
}

/* ─── Custom Tooltip ──────────────────────────────────────────────── */
function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-purple-100 rounded-2xl px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {inr(p.value)}
        </p>
      ))}
    </div>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────────── */
function StatCard({ title, value, sub, icon, gradient, glow }) {
  return (
    <div className="relative bg-white rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      <div
        className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-xl ${glow}`}
      />
      <div className="absolute top-4 right-4 text-2xl">{icon}</div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
        {title}
      </p>
      <p
        className={`text-3xl font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-1 leading-tight`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}

/* ─── Recent Tx Row ───────────────────────────────────────────────── */
function TxRow({ tx }) {
  const isInc = tx.type === "income";
  return (
    <div className="flex items-center gap-3 py-3 border-b border-purple-50 last:border-0">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
          isInc ? "bg-green-50" : "bg-red-50"
        }`}
      >
        {isInc ? "📥" : "📤"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {tx.description || tx.category}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {tx.category} · {tx.date}
        </p>
      </div>
      <p
        className={`font-bold text-sm flex-shrink-0 ${
          isInc ? "text-green-600" : "text-red-500"
        }`}
      >
        {isInc ? "+" : "−"}
        {inr(tx.amount)}
      </p>
    </div>
  );
}

/* ─── Dashboard ───────────────────────────────────────────────────── */
export default function Dashboard() {
  const { transactions } = useTransactions();
  const navigate = useNavigate(); // used for profile button

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  const savings = income - expense;
  const tax = Math.round(income * 0.25);

  const barData = getMonthlyData(transactions);
  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
    { name: "Savings", value: Math.max(0, savings) },
  ].filter((d) => d.value > 0);
  const PIE_COLORS = ["#9333ea", "#ec4899", "#10b981"];

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold leading-tight">
            Dashboard{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Overview
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Income"
            value={inr(income)}
            sub={`${transactions.filter((t) => t.type === "income").length} credits`}
            icon="📈"
            gradient="from-purple-600 to-pink-600"
            glow="bg-purple-400"
          />
          <StatCard
            title="Total Expense"
            value={inr(expense)}
            sub={`${transactions.filter((t) => t.type === "expense").length} debits`}
            icon="💸"
            gradient="from-pink-600 to-rose-500"
            glow="bg-pink-400"
          />
          <StatCard
            title="Est. Tax (25%)"
            value={inr(tax)}
            sub="Based on total income"
            icon="🧾"
            gradient="from-orange-500 to-amber-500"
            glow="bg-orange-300"
          />
          <StatCard
            title="Net Savings"
            value={inr(Math.max(0, savings))}
            sub={
              income
                ? `${Math.round((savings / income) * 100)}% savings rate`
                : "—"
            }
            icon="💎"
            gradient="from-emerald-500 to-teal-500"
            glow="bg-emerald-300"
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800">Income vs Expense</h2>
            <p className="text-xs text-gray-400 mb-5 mt-1">Monthly comparison</p>
            {barData.length >= 2 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barSize={16} barGap={4}>
                  <defs>
                    <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#fb923c" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="#f3e8ff"
                    strokeDasharray="4 4"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={<Tip />}
                    cursor={{ fill: "rgba(147,51,234,0.04)" }}
                  />
                  <Bar
                    dataKey="Income"
                    fill="url(#gInc)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="Expense"
                    fill="url(#gExp)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-300 gap-2">
                <span className="text-5xl">📊</span>
                <p className="text-sm text-gray-400">
                  Add transactions across 2+ months to see chart
                </p>
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800">Financial Breakdown</h2>
            <p className="text-xs text-gray-400 mb-5 mt-1">Distribution overview</p>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    innerRadius={56}
                    paddingAngle={3}
                    label={({ percent }) => `${Math.round(percent * 100)}%`}
                    labelLine={{ stroke: "#d8b4fe", strokeWidth: 1 }}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<Tip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => (
                      <span className="text-xs text-gray-700">{v}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-300 gap-2">
                <span className="text-5xl">🥧</span>
                <p className="text-sm text-gray-400">
                  Add transactions to see breakdown
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Recent Transactions
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Last 5 entries · live from Transactions page
              </p>
            </div>
            <a
              href="/transactions"
              className="text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-full transition-colors"
            >
              View all →
            </a>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-10 text-gray-300">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-sm text-gray-400">
                No transactions yet. Head to the Transactions page to add some!
              </p>
            </div>
          ) : (
            recent.map((tx) => <TxRow key={tx.id} tx={tx} />)
          )}
        </div>
      </div>

      {/* bottom-right profile button → go to settings/categories */}
      <button
        onClick={() => navigate("/settings/categories")}
        className="fixed bottom-10 right-10 z-40 w-16 h-16 rounded-full bg-white shadow-xl border border-purple-200 flex items-center justify-center hover:scale-105 hover:shadow-2xl transition-transform"
        title="Open settings"
      >
        <span className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white text-base font-bold flex items-center justify-center">
          P
        </span>
      </button>
    </div>
  );
}
