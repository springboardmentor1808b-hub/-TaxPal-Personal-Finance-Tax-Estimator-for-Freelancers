import { useState } from "react";
import Sidebar from "../components/Sidebar";

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

export default function TaxEstimator() {
  const [form, setForm] = useState({
    country: "usa",
    state: "",
    filingStatus: "single",
    quarter: "Q2-2025",
    grossIncome: "",
    businessExpenses: "",
    retirement: "",
    healthInsurance: "",
    homeOffice: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTax = async (e) => {
    e.preventDefault();

    const income = Number(form.grossIncome || 0);
    const deductions =
      Number(form.businessExpenses || 0) +
      Number(form.retirement || 0) +
      Number(form.healthInsurance || 0) +
      Number(form.homeOffice || 0);

    const taxable = Math.max(income - deductions, 0);
    let estimatedTax = 0;

    if (form.country === "india") {
      if (taxable <= 300000) estimatedTax = 0;
      else if (taxable <= 700000) estimatedTax = 0.05 * (taxable - 300000);
      else if (taxable <= 1000000) estimatedTax = 0.1 * (taxable - 700000) + 20000;
      else estimatedTax = 0.15 * (taxable - 1000000) + 50000;
    } else if (form.country === "usa") {
      const selfEmploymentTax = taxable * 0.153;
      const incomeTax = taxable * 0.12;
      estimatedTax = selfEmploymentTax + incomeTax;
    }

    setResult({ taxable, estimatedTax });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to save your tax estimate.");
        return;
      }

      const taxDataToSave = {
        country: form.country,
        state: form.state,
        filingStatus: form.filingStatus,
        quarter: form.quarter,
        grossIncome: income,
        totalDeductions: deductions,
        taxableIncome: taxable,
        estimatedTax: estimatedTax
      };

      const response = await fetch("http://localhost:5000/api/taxes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token 
        },
        body: JSON.stringify(taxDataToSave)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Tax estimate calculated and saved to database!");
      } else {
        alert("Failed to save: " + data.message);
      }

    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };
  const currency = form.country === "india" ? "₹" : "$";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Tax Estimator
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Calculate your estimated quarterly tax for India or the United States.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form side */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 mb-4">
              Quarterly Tax Calculator
            </h2>

            <form onSubmit={calculateTax} className="space-y-4">
              {/* Row 1: Country / State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Country / Region">
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="usa">United States</option>
                    <option value="india">India</option>
                  </select>
                </Field>

                <Field label="State / Province">
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="e.g. California / Tamil Nadu"
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* Row 2: Filing status / Quarter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Filing Status">
                  <select
                    name="filingStatus"
                    value={form.filingStatus}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </Field>

                <Field label="Quarter">
                  <select
                    name="quarter"
                    value={form.quarter}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="Q1-2025">Q1 (Jan–Mar 2025)</option>
                    <option value="Q2-2025">Q2 (Apr–Jun 2025)</option>
                    <option value="Q3-2025">Q3 (Jul–Sep 2025)</option>
                    <option value="Q4-2025">Q4 (Oct–Dec 2025)</option>
                  </select>
                </Field>
              </div>

              {/* Income */}
              <Field label="Gross Income for Quarter">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    {currency}
                  </span>
                  <input
                    type="number"
                    name="grossIncome"
                    min="0"
                    placeholder="0.00"
                    value={form.grossIncome}
                    onChange={handleChange}
                    className={`${inputCls} pl-8`}
                  />
                </div>
              </Field>

              {/* Deductions */}
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-6">
                Deductions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Business Expenses">
                  <input
                    type="number"
                    name="businessExpenses"
                    min="0"
                    placeholder="0.00"
                    value={form.businessExpenses}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </Field>
                <Field label="Retirement Contributions">
                  <input
                    type="number"
                    name="retirement"
                    min="0"
                    placeholder="0.00"
                    value={form.retirement}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </Field>
                <Field label="Health Insurance Premiums">
                  <input
                    type="number"
                    name="healthInsurance"
                    min="0"
                    placeholder="0.00"
                    value={form.healthInsurance}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </Field>
                <Field label="Home Office Deduction">
                  <input
                    type="number"
                    name="homeOffice"
                    min="0"
                    placeholder="0.00"
                    value={form.homeOffice}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-blue-200 transition-all"
                >
                  Calculate Estimated Tax
                </button>
              </div>
            </form>
          </div>

          {/* Summary side */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-2">
                Tax Summary
              </h2>
              {!result ? (
                <p className="text-xs text-gray-400">
                  Enter your income and deduction details to calculate your
                  estimated quarterly tax.
                </p>
              ) : (
                <div className="space-y-2 text-sm">
                  <p className="text-gray-500">
                    Country:{" "}
                    <span className="font-semibold text-gray-800">
                      {form.country === "india" ? "India" : "United States"}
                    </span>
                  </p>
                  <p className="text-gray-500">
                    Taxable income:{" "}
                    <span className="font-semibold text-gray-800">
                      {currency} {result.taxable.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-gray-500">
                    Estimated quarterly tax:{" "}
                    <span className="font-semibold text-blue-600">
                      {currency} {result.estimatedTax.toFixed(2)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
