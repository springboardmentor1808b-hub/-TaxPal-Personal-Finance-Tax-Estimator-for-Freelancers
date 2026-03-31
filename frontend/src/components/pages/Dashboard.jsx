import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Calculator,
  BarChart3,
  LogOut,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  User,
  CalendarDays
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import API from "../../api";

const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const Dashboard = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    netWorth: 0
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const COLORS = ["#ff4d00","#1a1a1a","#10b981","#ef4444","#6366f1"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await API.get("/transactions/summary");
        const monthlyRes = await API.get("/transactions/monthly-report");
        const categoryRes = await API.get("/transactions/category-breakdown");
        const transactionsRes = await API.get("/transactions");

        setSummary(summaryRes.data);

        // Monthly Transform
        const formattedMonthly = {};

        monthlyRes.data.report.forEach((item) => {
          const month = monthNames[item._id.month - 1];

          if (!formattedMonthly[month]) {
            formattedMonthly[month] = {
              name: month,
              income: 0,
              expenses: 0
            };
          }

          if (item._id.type === "income") {
            formattedMonthly[month].income = item.total;
          } else {
            formattedMonthly[month].expenses = item.total;
          }
        });

        setMonthlyData(Object.values(formattedMonthly));

        // Category Transform
        const formattedCategory = categoryRes.data.categories.map((cat) => ({
          name: cat._id,
          value: cat.total
        }));

        setExpenseData(formattedCategory);

        setTransactions(
          transactionsRes.data.transactions || transactionsRes.data
        );

      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#fdfaf5] font-sans text-slate-700">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1a1a1a] flex flex-col fixed h-full shadow-2xl">
        <div className="p-8">
          <h1 className="text-3xl font-black italic text-white">
            Tax<span className="text-[#ff4d00]">Pal</span>
          </h1>
        </div>

        <nav className="flex-1 px-3 mt-2 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active onClick={() => navigate("/dashboard")} />
          <NavItem icon={<ArrowLeftRight size={20} />} label="Transactions" onClick={() => navigate("/transactions")} />
          <NavItem icon={<Wallet size={20} />} label="Budgets" onClick={() => navigate("/budgets")} />
          <NavItem icon={<Calculator size={20} />} label="Tax Estimator" onClick={() => navigate("/tax-estimator")} />
          <NavItem icon={<CalendarDays size={20} />} label="Tax Calendar" onClick={() => navigate("/tax-calendar")} />
          <NavItem icon={<BarChart3 size={20} />} label="Reports" />
          <NavItem icon={<User size={20} />} label="Profile" onClick={() => navigate("/profile")} />
        </nav>

        {/* USER SECTION */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3 text-white">
            <div className="w-8 h-8 bg-[#ff4d00] rounded-full flex items-center justify-center text-sm font-semibold">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#ff4d00] transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      {/* MAIN CONTENT */}
<main className="flex-1 ml-64 p-10">

  <header className="mb-10 flex justify-between items-end">
    <div>
      <h2 className="text-4xl font-black text-[#1a1a1a]">Overview</h2>
      <p className="text-gray-500">Track your earnings and expenses.</p>
    </div>
  </header>

  {/* Action Buttons */}
  <div className="flex gap-4 mb-10">
    <button
      onClick={() => navigate("/income")}
      className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all"
    >
      + Add Income
    </button>

    <button
      onClick={() => navigate("/expense")}
      className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all"
    >
      + Add Expense
    </button>
  </div>

  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <StatCard
      label="Total Income"
      value={`₹${summary?.income || 0}`}
      icon={<TrendingUp className="text-emerald-500" />}
    />
    <StatCard
      label="Total Expense"
      value={`₹${summary?.expense || 0}`}
      icon={<TrendingDown className="text-rose-500" />}
    />
    <StatCard
      label="Net Worth"
      value={`₹${summary?.netWorth || 0}`}
      icon={<CircleDollarSign className="text-blue-500" />}
    />
  </div>

  {/* Income vs Expense Chart */}
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
    <h3 className="font-bold mb-6 text-[#1a1a1a]">Income vs Expenses</h3>
    <div className="w-full h-80">
      <ResponsiveContainer>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: "#fdfaf5" }} />
          <Bar dataKey="income" fill="#ff4d00" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Bottom Section */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

    {/* Recent Transactions */}
    <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="font-bold mb-6 text-[#1a1a1a]">Recent Transactions</h3>
      <div className="space-y-1">
        {transactions.slice(0, 5).map((t) => (
          <div
            key={t._id}
            className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0"
          >
            <span className="font-bold text-slate-700">
              {t.category}
            </span>
            <span
              className={
                t.type === "income"
                  ? "text-emerald-500 font-black"
                  : "text-rose-500 font-black"
              }
            >
              {t.type === "income" ? "+" : "-"} ₹
              {t.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Expense Breakdown (Pie Chart) */}
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="font-bold mb-6 text-[#1a1a1a]">Expense Breakdown</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={expenseData}
              dataKey="value"
              outerRadius={80}
              innerRadius={60}
              paddingAngle={5}
            >
              {expenseData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

  </div>

</main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-[#ff4d00] text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-700/40"
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="mb-2 p-2 bg-gray-50 w-fit rounded-lg">{icon}</div>
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <h4 className="text-2xl font-black text-[#1a1a1a]">{value}</h4>
  </div>
);

export default Dashboard;