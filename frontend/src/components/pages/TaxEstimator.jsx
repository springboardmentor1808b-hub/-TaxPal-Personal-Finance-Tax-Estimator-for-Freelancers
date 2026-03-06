import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Calculator,
  BarChart3,
  User,
  LogOut,
  CalendarDays
} from "lucide-react";
import API from "../../api";

const TaxEstimator = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    financialYear: "2025-26",
    quarter: "Q1",
    taxpayerType: "Salaried",
    totalIncome: "",
    totalDeductions: "",
    tds: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estimateExists, setEstimateExists] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const buildPayload = (save = false, replace = false) => {
    return {
      financialYear: form.financialYear,
      quarter: form.quarter,
      totalIncome: Number(form.totalIncome),
      totalDeductions: Number(form.totalDeductions) || 0,
      isSalaried: form.taxpayerType === "Salaried",
      tds: form.taxpayerType === "Salaried"
        ? Number(form.tds) || 0
        : 0,
      saveEstimate: save,
      replaceEstimate: replace
    };
  };

  const calculateTax = async () => {
    try {
      setLoading(true);

      const res = await API.post("/tax/calculate", buildPayload(false,false));

      setResult(res.data.data);
      setEstimateExists(res.data.data.estimateExists);

    } catch (err) {
      alert(err.response?.data?.message || "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  const saveEstimate = async () => {
    try {
      setLoading(true);

      const res = await API.post("/tax/calculate", buildPayload(true,false));

      setResult(res.data.data);
      alert("Estimate Saved");

    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const replaceEstimate = async () => {
    try {
      setLoading(true);

      const res = await API.post("/tax/calculate", buildPayload(true,true));

      setResult(res.data.data);
      alert("Estimate Updated");

    } catch (err) {
      alert(err.response?.data?.message || "Replace failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdfaf5]">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1a1a1a] flex flex-col fixed h-full">
        <div className="p-8">
          <h1 className="text-3xl font-black italic text-white">
            Tax<span className="text-[#ff4d00]">Pal</span>
          </h1>
        </div>

        <nav className="flex-1 px-3 mt-2 space-y-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={()=>navigate("/dashboard")} />
          <NavItem icon={<ArrowLeftRight size={20}/>} label="Transactions" />
          <NavItem icon={<Wallet size={20}/>} label="Budgets" />
          <NavItem icon={<Calculator size={20}/>} label="Tax Estimator" active />
          <NavItem icon={<CalendarDays size={20}/>} label="Tax Calendar" />
          <NavItem icon={<BarChart3 size={20}/>} label="Reports" />
          <NavItem icon={<User size={20}/>} label="Profile" />
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={()=>{
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#ff4d00]"
          >
            <LogOut size={14}/> Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-64 p-10">

        <h1 className="text-4xl font-black mb-6">Tax Estimator</h1>

        <div className="grid grid-cols-3 gap-6">

          {/* FORM */}
          <div className="col-span-2 bg-white p-8 rounded-3xl shadow">

            <h2 className="text-lg font-bold mb-4">
              Quarterly Tax Calculator
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">

              <select
                name="financialYear"
                value={form.financialYear}
                onChange={handleChange}
                className="border p-3 rounded-xl"
              >
                <option>2024-25</option>
                <option>2025-26</option>
                <option>2026-27</option>
              </select>

              <select
                name="quarter"
                value={form.quarter}
                onChange={handleChange}
                className="border p-3 rounded-xl"
              >
                <option>Q1</option>
                <option>Q2</option>
                <option>Q3</option>
                <option>Q4</option>
              </select>

            </div>

            <select
              name="taxpayerType"
              value={form.taxpayerType}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mb-4"
            >
              <option>Salaried</option>
              <option>Business</option>
            </select>

            <input
              type="number"
              name="totalIncome"
              placeholder="Total Income"
              value={form.totalIncome}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mb-4"
            />

            <input
              type="number"
              name="totalDeductions"
              placeholder="Total Deductions"
              value={form.totalDeductions}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mb-4"
            />

            {form.taxpayerType === "Salaried" && (
              <input
                type="number"
                name="tds"
                placeholder="TDS Deducted"
                value={form.tds}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl mb-4"
              />
            )}

            <div className="flex gap-3">

              <button
                onClick={calculateTax}
                disabled={loading}
                className="bg-[#ff4d00] text-white px-6 py-3 rounded-xl font-bold"
              >
                Estimate Tax
              </button>

              <button
                onClick={saveEstimate}
                className="bg-black text-white px-6 py-3 rounded-xl"
              >
                Save Estimate
              </button>

              {estimateExists && (
                <button
                  onClick={replaceEstimate}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-xl"
                >
                  Replace Estimate
                </button>
              )}

            </div>
          </div>

          {/* RESULT */}
          <div className="bg-white p-8 rounded-3xl shadow">

            <h2 className="font-bold mb-4">Result</h2>

            {!result && (
              <p className="text-gray-400">
                Enter income to estimate tax
              </p>
            )}

            {result && (
              <div className="space-y-3">

                <div>
                  <b>Taxable Income:</b> ₹{result.taxableIncome}
                </div>

                <div>
                  <b>Total Annual Tax:</b> ₹{result.totalAnnualTax}
                </div>

                <div className="text-xl font-bold text-[#ff4d00]">
                  Payable Till {form.quarter}: ₹{result.payableTillQuarter}
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
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer ${
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