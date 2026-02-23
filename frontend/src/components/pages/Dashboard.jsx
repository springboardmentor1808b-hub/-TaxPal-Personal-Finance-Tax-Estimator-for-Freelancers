import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart,
  Pie, Cell, Legend
} from "recharts";
import {
  LayoutDashboard, ArrowLeftRight, Wallet,
  Calculator, BarChart3, LogOut,
  TrendingUp, TrendingDown,
  CircleDollarSign, ChevronUp, User
} from "lucide-react";
import API from "../../api";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const Dashboard = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user] = useState(storedUser || {});
  const [summary, setSummary] = useState({ income:0, expense:0, netWorth:0 });
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

        // Monthly transform
        const formattedMonthly = {};
        monthlyRes.data.report.forEach(item => {
          const month = monthNames[item._id.month - 1];

          if (!formattedMonthly[month]) {
            formattedMonthly[month] = { name: month, income: 0, expenses: 0 };
          }

          if (item._id.type === "income") {
            formattedMonthly[month].income = item.total;
          } else {
            formattedMonthly[month].expenses = item.total;
          }
        });

        setMonthlyData(Object.values(formattedMonthly));

        // Category transform
        const formattedCategory = categoryRes.data.categories.map(cat => ({
          name: cat._id,
          value: cat.total
        }));

        setExpenseData(formattedCategory);

        setTransactions(transactionsRes.data.transactions);

      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-cream font-sans text-slate-700">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1a1a1a] flex flex-col fixed h-full shadow-2xl">
        <div className="p-8">
          <h1 className="text-3xl font-black italic text-white">
            Tax<span className="text-[#ff4d00]">Pal</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<ArrowLeftRight size={20} />} label="Transactions" />
          <NavItem icon={<Wallet size={20} />} label="Budgets" />
          <NavItem icon={<Calculator size={20} />} label="Tax Estimator" />
          <NavItem icon={<BarChart3 size={20} />} label="Reports" />
          <NavItem icon={<User size={20} />} label="Profile" />
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 p-2 mb-4 text-white">
            <div className="w-10 h-10 bg-[#ff4d00] rounded-full flex items-center justify-center font-bold">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#ff4d00]"
          >
            <LogOut size={16}/> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-10">

        {/* Header */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-[#1a1a1a]">
              Overview
            </h2>
            <p className="text-gray-500">
              Track your earnings and expenses.
            </p>
          </div>
        </header>

        {/* Add Buttons */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => navigate("/income")}
            className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold"
          >
            + Add Income
          </button>

          <button
            onClick={() => navigate("/expense")}
            className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold"
          >
            + Add Expense
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Income" value={`₹${summary?.income || 0}`} icon={<TrendingUp/>}/>
          <StatCard label="Total Expense" value={`₹${summary?.expense || 0}`} icon={<TrendingDown/>}/>
          <StatCard label="Net Worth" value={`₹${summary?.netWorth || 0}`} icon={<CircleDollarSign/>}/>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-8 rounded-3xl shadow mb-10">
          <h3 className="font-bold mb-6">Income vs Expenses</h3>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#ff4d00" />
                <Bar dataKey="expenses" fill="#1a1a1a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow">
            <h3 className="font-bold mb-6">Recent Transactions</h3>
            {transactions.map(t => (
              <div key={t._id} className="flex justify-between py-2 border-b">
                <span>{t.category}</span>
                <span className={t.type==="income"?"text-green-600":"text-red-600"}>
                  ₹{t.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <h3 className="font-bold mb-6">Expense Breakdown</h3>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={expenseData} dataKey="value" outerRadius={80}>
                    {expenseData.map((entry,index)=>(
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip/>
                  <Legend/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active=false }) => (
  <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer ${
    active ? 'bg-[#ff4d00] text-white font-bold' : 'text-gray-400 hover:text-white'
  }`}>
    {icon}
    <span>{label}</span>
  </div>
);

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow">
    <div className="mb-2">{icon}</div>
    <p className="text-gray-500 text-sm">{label}</p>
    <h4 className="text-2xl font-bold">{value}</h4>
  </div>
);

export default Dashboard;