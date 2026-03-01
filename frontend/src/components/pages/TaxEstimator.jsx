import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Calculator,
  BarChart3,
  User,
  LogOut
} from "lucide-react";
import API from "../../api";

const TaxEstimator = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    country: "India",
    state: "",
    filingStatus: "Single",
    quarter: "Q1",
    income: "",
    expenses: "",
    retirement: "",
    insurance: "",
    homeOffice: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const calculateTax = async () => {
    try {
      const res = await API.post("/tax/calculate", form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Tax calculation failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdfaf5]">

      {/* SIDEBAR — SAME AS TRANSACTIONS */}
      <aside className="w-64 bg-[#1a1a1a] flex flex-col fixed h-full">

        {/* LOGO */}
        <div className="p-8">
          <h1 className="text-3xl font-black italic text-white">
            Tax<span className="text-[#ff4d00]">Pal</span>
          </h1>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 mt-2 space-y-1">

          <NavItem
            icon={<LayoutDashboard size={20}/>}
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />

          <NavItem
            icon={<ArrowLeftRight size={20}/>}
            label="Transactions"
            onClick={() => navigate("/transactions")}
          />

          <NavItem
            icon={<Wallet size={20}/>}
            label="Budgets"
            onClick={() => navigate("/budgets")}
          />

          <NavItem
            icon={<Calculator size={20}/>}
            label="Tax Estimator"
            active
          />
          <NavItem
  icon={<CalendarDays size={20}/>}
  label="Tax Calendar"
  onClick={() => navigate("/tax-calendar")}
/>

          <NavItem
            icon={<BarChart3 size={20}/>}
            label="Reports"
          />

          <NavItem
            icon={<User size={20}/>}
            label="Profile"
            onClick={() => navigate("/profile")}
          />

        </nav>

        {/* USER INFO  */}
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

      {/* MAIN CONTENT — COMPLETELY UNCHANGED */}
      <main className="flex-1 ml-64 p-10">

        <h1 className="text-4xl font-black mb-6">
          Tax Estimator
        </h1>

        <div className="grid grid-cols-3 gap-6">

          {/* LEFT FORM */}
          <div className="col-span-2 bg-white p-8 rounded-3xl shadow">

            <h2 className="text-lg font-bold mb-4">
              Quarterly Tax Calculator
            </h2>

            {/* COUNTRY + STATE */}
            <div className="grid grid-cols-2 gap-4 mb-4">

              <div>
                <label>Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option>India</option>
                  <option>USA</option>
                </select>
              </div>

              <div>
                <label>State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

            </div>

            {/* STATUS + QUARTER */}
            <div className="grid grid-cols-2 gap-4 mb-4">

              <div>
                <label>Filing Status</label>
                <select
                  name="filingStatus"
                  value={form.filingStatus}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option>Single</option>
                  <option>Married</option>
                </select>
              </div>

              <div>
                <label>Quarter</label>
                <select
                  name="quarter"
                  value={form.quarter}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option>Q1</option>
                  <option>Q2</option>
                  <option>Q3</option>
                  <option>Q4</option>
                </select>
              </div>

            </div>

            {/* INCOME */}
            <div className="mb-4">
              <label>Income</label>
              <input
                name="income"
                value={form.income}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            {/* DEDUCTIONS */}
            <div className="grid grid-cols-2 gap-4 mb-4">

              <div>
                <label>Business Expenses</label>
                <input
                  name="expenses"
                  value={form.expenses}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label>Retirement</label>
                <input
                  name="retirement"
                  value={form.retirement}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label>Insurance</label>
                <input
                  name="insurance"
                  value={form.insurance}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label>Home Office</label>
                <input
                  name="homeOffice"
                  value={form.homeOffice}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

            </div>

            <button
              onClick={calculateTax}
              className="bg-[#ff4d00] text-white px-6 py-3 rounded-xl font-bold"
            >
              Calculate Estimated Tax
            </button>

          </div>

          {/* SUMMARY */}
          <div className="bg-white p-8 rounded-3xl shadow">

            <h2 className="font-bold mb-4">
              Tax Summary
            </h2>

            {!result && (
              <p className="text-gray-400">
                Enter your income and deductions.
              </p>
            )}

            {result && (
              <div className="space-y-3">

                <div>
                  Income: ₹{result.totalIncome}
                </div>

                <div>
                  Deductions: ₹{result.deductions}
                </div>

                <div>
                  Taxable Income: ₹{result.taxableIncome}
                </div>

                <div className="text-xl font-bold text-[#ff4d00]">
                  Estimated Tax: ₹{result.estimatedTax}
                </div>

              </div>
            )}

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

export default TaxEstimator;
