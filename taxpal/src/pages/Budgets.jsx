import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useCategories } from "../context/CategoryContext";
import { api } from "../utils/api";

/* ─── Month options for picker ─────────────────────────────────────── */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getMonthOptions() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const options = [];
  for (let y = currentYear - 1; y <= currentYear + 2; y++) {
    for (let m = 0; m < 12; m++) {
      options.push({
        value: `${y}-${String(m + 1).padStart(2, "0")}`,
        label: `${MONTHS[m]}, ${y}`,
      });
    }
  }
  return options;
}

const MONTH_OPTIONS = getMonthOptions();

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/* ─── Field wrapper ───────────────────────────────────────────────── */
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

const inputCls =
  "w-full bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-gray-300";

/* ─── Budgets Page ─────────────────────────────────────────────────── */
export default function Budgets() {
  const { expenseCategories, getCategoryColor } = useCategories();
  const expenseCatNames = expenseCategories.map((c) => c.name);

  // custom categories only for budgets page
  const [customCategories, setCustomCategories] = useState([]);

  const allCategories = [...expenseCatNames, ...customCategories];
  const defaultCategory = allCategories[0] || "";

  const [budgets, setBudgets] = useState([]);

  // load budgets from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await api('/api/budgets');
        const data = await res.json();
        if (res.ok) {
          const norm = data.budgets.map((b) => ({ ...b, id: b._id }));
          setBudgets(norm);
        } else {
          console.error('failed to fetch budgets', data.message);
        }
      } catch (err) {
        console.error('error fetching budgets', err);
      }
    })();
  }, []);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: "",
    description: "",
  });

  // when categories change, set default if empty
  useEffect(() => {
    if (!form.category && allCategories.length) {
      setForm((f) => ({ ...f, category: allCategories[0] }));
    }
  }, [allCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // handle special "Add custom category" option
    if (name === "category" && value === "__add_new__") {
      const label = window.prompt("Enter custom category name:");
      if (label && label.trim()) {
        const newCat = label.trim();
        setCustomCategories((prev) =>
          prev.includes(newCat) ? prev : [...prev, newCat]
        );
        setForm((prev) => ({ ...prev, category: newCat }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setForm({
      category: defaultCategory,
      amount: "",
      month: "",
      description: "",
    });
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();

    if (!form.category || !form.amount || !form.month) {
      return;
    }

    const amount = Number(form.amount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      const res = await api('/api/budgets', {
        method: 'POST',
        body: JSON.stringify({
          category: form.category,
          amount,
          month: form.month,
          description: form.description || '',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const newBudget = { ...data.budget, id: data.budget._id };
        setBudgets((prev) => [...prev, newBudget]);
        setForm({
          category: defaultCategory,
          amount: "",
          month: "",
          description: "",
        });
      } else {
        console.error('create budget failed', data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api(`/api/budgets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBudgets((prev) => prev.filter((b) => b.id !== id));
      } else {
        const data = await res.json();
        console.error('delete budget failed', data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatus = (amount, spent) =>
    spent <= amount ? "On Track" : "Over Budget";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Budgets
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Create and manage budgets by category. Track spending against your
            limits.
          </p>
        </div>

        {/* Create New Budget Card */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            Create New Budget
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            Set a budget for any expense category
          </p>

          <form onSubmit={handleCreateBudget}>
            {/* Horizontal row: Category, Budget Amount, Month */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Category */}
              <Field label="Category">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputCls}
                  required
                >
                  {allCategories.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}

                  <option value="__add_new__">+ Add custom category…</option>
                </select>
              </Field>

              {/* Budget Amount */}
              <Field label="Budget Amount">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0"
                    min="1"
                    value={form.amount}
                    onChange={handleChange}
                    className={`${inputCls} pl-8`}
                    required
                  />
                </div>
              </Field>

              {/* Month */}
              <Field label="Month">
                <input
                  type="month"
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </Field>
            </div>

            {/* Description: full width below */}
            <div className="mb-6">
              <Field label="Description (Optional)">
                <textarea
                  name="description"
                  placeholder="e.g. Monthly food budget"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Buttons: bottom right */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 border-2 border-purple-200 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all text-sm"
              >
                Create Budget
              </button>
            </div>
          </form>
        </div>

        {/* Progress section */}
        {budgets.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Budget Progress
            </h2>
            <div className="space-y-4">
              {budgets.map((b) => {
                const pct =
                  b.amount > 0
                    ? Math.min((b.spent / b.amount) * 100, 100)
                    : 0;
                const isOver = b.spent > b.amount;
                return (
                  <div key={b.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: getCategoryColor(b.category),
                          }}
                        />
                        {b.category}
                      </span>
                      <span
                        className={
                          isOver
                            ? "text-rose-600 font-semibold"
                            : "text-gray-500"
                        }
                      >
                        {inr(b.spent)} / {inr(b.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          isOver
                            ? "bg-rose-500"
                            : "bg-gradient-to-r from-purple-500 to-pink-500"
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-50">
            <h2 className="text-lg font-bold text-gray-800">Your Budgets</h2>
          </div>

          {budgets.length === 0 ? (
            <div className="text-center py-16 text-gray-300">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-sm text-gray-400">
                No budgets yet. Create one above!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50">
                  <tr>
                    {[
                      "Category",
                      "Budget",
                      "Spent",
                      "Remaining",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-purple-400 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((b, i) => {
                    const remaining = b.amount - b.spent;
                    const status = getStatus(b.amount, b.spent);
                    return (
                      <tr
                        key={b.id}
                        className={`hover:bg-purple-50/50 transition-colors ${
                          i < budgets.length - 1
                            ? "border-b border-purple-50"
                            : ""
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{
                                backgroundColor: getCategoryColor(b.category),
                              }}
                            />
                            <span className="text-sm text-gray-700 font-medium">
                              {b.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {inr(b.amount)}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {inr(b.spent)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={
                              remaining < 0
                                ? "text-rose-600 font-semibold"
                                : "text-gray-700"
                            }
                          >
                            {inr(remaining)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                              status === "On Track"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {status === "On Track" ? "✓" : "!"} {status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="text-rose-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
