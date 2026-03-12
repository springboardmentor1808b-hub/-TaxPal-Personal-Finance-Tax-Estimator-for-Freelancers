import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useCategories } from "../context/CategoryContext";
import { useTransactions } from "../context/TransactionContext";
import { api } from "../utils/api";

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

function computeSpent(transactions, category, month) {
  return transactions
    .filter((tx) => {
      if (tx.type !== "expense") return false;
      if (tx.category?.toLowerCase() !== category?.toLowerCase()) return false;
      if (!tx.date) return false;
      return tx.date.startsWith(month);
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
}

/* ── Duplicate Conflict Modal ─────────────────────────────────────────────── */
function DuplicateModal({ conflict, onDelete, onEdit, onCancel, fmt, currency }) {
  const { existing, incoming } = conflict;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-purple-100 w-full max-w-md mx-4 overflow-hidden animate-[fadeSlideUp_0.22s_ease-out]">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

        <div className="px-7 pt-6 pb-7">
          {/* Icon + heading */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-2xl">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 leading-tight">
                Duplicate Budget Detected
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                A budget for{" "}
                <span className="font-semibold text-purple-600">
                  {existing.category}
                </span>{" "}
                in{" "}
                <span className="font-semibold text-purple-600">
                  {existing.month}
                </span>{" "}
                already exists.
              </p>
            </div>
          </div>

          {/* Comparison card */}
          <div className="bg-purple-50 rounded-2xl border border-purple-100 divide-y divide-purple-100 mb-6 text-sm overflow-hidden">
            <div className="flex justify-between items-center px-5 py-3">
              <span className="text-gray-500 font-medium">Existing budget</span>
              <span className="font-bold text-gray-800">
                {currency.symbol}{existing.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-3">
              <span className="text-gray-500 font-medium">New amount you entered</span>
              <span className="font-bold text-purple-700">
                {currency.symbol}{incoming.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            {/* Edit / update existing */}
            <button
              onClick={onEdit}
              className="w-full flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all text-sm"
            >
              <span className="text-lg">✏️</span>
              <div className="text-left">
                <div>Update existing budget</div>
                <div className="text-xs font-normal opacity-80">
                  Change amount to {currency.symbol}{incoming.amount.toLocaleString()}
                </div>
              </div>
            </button>

            {/* Delete existing + create new */}
            <button
              onClick={onDelete}
              className="w-full flex items-center gap-3 px-5 py-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-2xl transition-all text-sm"
            >
              <span className="text-lg">🗑️</span>
              <div className="text-left">
                <div>Delete existing &amp; create new</div>
                <div className="text-xs font-normal text-rose-500">
                  Remove the old entry and add a fresh one
                </div>
              </div>
            </button>

            {/* Cancel */}
            <button
              onClick={onCancel}
              className="w-full px-5 py-3 border-2 border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 font-semibold rounded-2xl transition-all text-sm"
            >
              Cancel — keep both separate
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
      `}</style>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────────── */
export default function Budgets() {
  const { expenseCategories, getCategoryColor } = useCategories();
  const { transactions, fmt, currency, setBudgets: syncBudgetsToContext } = useTransactions();

  const expenseCatNames = expenseCategories.map((c) => c.name);
  const [customCategories, setCustomCategories] = useState([]);
  const allCategories = [...expenseCatNames, ...customCategories];

  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Duplicate conflict state
  const [conflict, setConflict] = useState(null); // { existing, incoming }

  // Load budgets from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const res  = await api("/api/budgets");
        const data = await res.json();
        if (res.ok && data.budgets) {
          setBudgets(data.budgets.map((b) => ({ ...b, id: b._id || b.id })));
        }
      } catch (err) {
        console.error("error fetching budgets", err);
      }
    })();
  }, []);

  // Set default category when categories load
  useEffect(() => {
    if (!form.category && allCategories.length) {
      setForm((f) => ({ ...f, category: allCategories[0] }));
    }
  }, [allCategories.length]);

  const enrichedBudgets = budgets.map((b) => ({
    ...b,
    spent: computeSpent(transactions, b.category, b.month),
  }));

  // Sync to context so Transactions page can read budgets
  useEffect(() => {
    syncBudgetsToContext(enrichedBudgets);
  }, [JSON.stringify(enrichedBudgets)]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category" && value === "__add_new__") {
      const label = window.prompt("Enter custom category name:");
      if (label?.trim()) {
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
    setError("");
    setForm({ category: allCategories[0] || "", amount: "", month: "", description: "" });
  };

  /* ── Core create logic (used directly or after conflict resolution) ──── */
  const persistBudget = async (payload) => {
    const res = await api("/api/budgets", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (res.ok && data.budget) {
      return { ...data.budget, id: data.budget._id || data.budget.id };
    }
    // Fallback local budget
    return {
      id:          Date.now().toString(),
      ...payload,
      spent:       0,
    };
  };

  const deleteFromBackend = async (id) => {
    try {
      await api(`/api/budgets/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("delete budget error", err);
    }
  };

  /* ── Form submit ──────────────────────────────────────────────────────── */
  const handleCreateBudget = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.category) { setError("Please select a category."); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError("Please enter a valid amount."); return; }
    if (!form.month) { setError("Please select a month."); return; }

    const amount = Number(form.amount);

    // ── Duplicate check ────────────────────────────────────────────────────
    const existing = budgets.find(
      (b) =>
        b.category?.toLowerCase() === form.category?.toLowerCase() &&
        b.month === form.month
    );

    if (existing) {
      // Show conflict modal instead of proceeding
      setConflict({
        existing,
        incoming: {
          category:    form.category,
          amount,
          month:       form.month,
          description: form.description || "",
        },
      });
      return;
    }

    // No duplicate — proceed normally
    await doCreate({ category: form.category, amount, month: form.month, description: form.description || "" });
  };

  const doCreate = async (payload) => {
    setSubmitting(true);
    try {
      const newBudget = await persistBudget(payload);
      setBudgets((prev) => [...prev, newBudget]);
      setForm({ category: allCategories[0] || "", amount: "", month: "", description: "" });
    } catch (err) {
      console.warn("Network error, adding locally:", err);
      const localBudget = { id: Date.now().toString(), ...payload, spent: 0 };
      setBudgets((prev) => [...prev, localBudget]);
      setForm({ category: allCategories[0] || "", amount: "", month: "", description: "" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Conflict resolution handlers ────────────────────────────────────── */

  // Update existing budget's amount (and optionally description)
  const handleConflictEdit = async () => {
    const { existing, incoming } = conflict;
    setConflict(null);

    // Optimistically update local state
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === existing.id
          ? { ...b, amount: incoming.amount, description: incoming.description || b.description }
          : b
      )
    );

    // Persist to backend (PATCH preferred; fallback: delete + recreate)
    try {
      const res = await api(`/api/budgets/${existing.id}`, {
        method: "PATCH",
        body: JSON.stringify({ amount: incoming.amount, description: incoming.description }),
      });
      if (!res.ok) throw new Error("patch failed");
    } catch {
      // PATCH not supported — delete old, create new
      await deleteFromBackend(existing.id);
      const newBudget = await persistBudget(incoming);
      setBudgets((prev) => [
        ...prev.filter((b) => b.id !== existing.id),
        newBudget,
      ]);
    }

    setForm({ category: allCategories[0] || "", amount: "", month: "", description: "" });
  };

  // Delete existing, then create new entry
  const handleConflictDelete = async () => {
    const { existing, incoming } = conflict;
    setConflict(null);

    // Remove old
    setBudgets((prev) => prev.filter((b) => b.id !== existing.id));
    await deleteFromBackend(existing.id);

    // Create new
    await doCreate(incoming);
  };

  // Cancel — dismiss modal, keep form data so user can adjust
  const handleConflictCancel = () => {
    setConflict(null);
  };

  /* ── Delete ───────────────────────────────────────────────────────────── */
  const handleDelete = async (id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    await deleteFromBackend(id);
  };

  const budgetAlerts = enrichedBudgets.filter((b) => b.spent > b.amount);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Sidebar />

      {/* Duplicate conflict modal */}
      {conflict && (
        <DuplicateModal
          conflict={conflict}
          fmt={fmt}
          currency={currency}
          onEdit={handleConflictEdit}
          onDelete={handleConflictDelete}
          onCancel={handleConflictCancel}
        />
      )}

      <div className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Budgets
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Create and manage budgets by category. Spending is tracked live from your transactions.
          </p>
        </div>

        {/* Over-budget alerts */}
        {budgetAlerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {budgetAlerts.map((b) => (
              <div key={b.id} className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-3">
                <span className="text-lg">⚠️</span>
                <p className="text-sm text-rose-700 font-semibold">
                  <span className="font-extrabold">{b.category}</span> budget exceeded!{" "}
                  Spent {fmt(b.spent)} of {fmt(b.amount)} for {b.month}.
                  <span className="ml-2 font-bold text-rose-600">({fmt(b.spent - b.amount)} over)</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Create Budget Form */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Create New Budget</h2>
          <p className="text-xs text-gray-400 mb-5">Set a budget for any expense category</p>

          {error && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium px-4 py-3 rounded-xl">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleCreateBudget}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Field label="Category">
                <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                  {allCategories.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                  <option value="__add_new__">+ Add custom category…</option>
                </select>
              </Field>

              <Field label={`Budget Amount (${currency.symbol})`}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    {currency.symbol}
                  </span>
                  <input type="number" name="amount" placeholder="0" min="1"
                    value={form.amount} onChange={handleChange}
                    className={`${inputCls} pl-8`} />
                </div>
              </Field>

              <Field label="Month">
                <input type="month" name="month" value={form.month}
                  onChange={handleChange} className={inputCls} />
              </Field>
            </div>

            <div className="mb-6">
              <Field label="Description (Optional)">
                <textarea name="description" placeholder="e.g. Monthly food budget"
                  value={form.description} onChange={handleChange}
                  rows={3} className={inputCls} />
              </Field>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={handleCancel}
                className="px-5 py-2.5 border-2 border-purple-200 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all text-sm">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? "Creating..." : "Create Budget"}
              </button>
            </div>
          </form>
        </div>

        {/* Budget Progress bars */}
        {enrichedBudgets.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Budget Progress</h2>
            <div className="space-y-5">
              {enrichedBudgets.map((b) => {
                const pct       = b.amount > 0 ? Math.min((b.spent / b.amount) * 100, 100) : 0;
                const isOver    = b.spent > b.amount;
                const remaining = b.amount - b.spent;
                return (
                  <div key={b.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: getCategoryColor(b.category) }} />
                        {b.category}
                        <span className="text-xs text-gray-400 font-normal">{b.month}</span>
                      </span>
                      <span className={isOver ? "text-rose-600 font-semibold" : "text-gray-500"}>
                        {fmt(b.spent)} / {fmt(b.amount)}
                        {isOver && (
                          <span className="ml-2 text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                            +{fmt(b.spent - b.amount)} over
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className={`h-3 rounded-full transition-all duration-500 ${
                        isOver ? "bg-gradient-to-r from-rose-500 to-red-400"
                        : pct > 80 ? "bg-gradient-to-r from-orange-400 to-amber-400"
                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                      }`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {isOver ? `Exceeded by ${fmt(Math.abs(remaining))}`
                        : `${fmt(remaining)} remaining · ${Math.round(pct)}% used`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Budgets Table */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-50">
            <h2 className="text-lg font-bold text-gray-800">Your Budgets</h2>
          </div>

          {enrichedBudgets.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-sm text-gray-400">No budgets yet. Create one above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "12%" }} />
                </colgroup>
                <thead className="bg-purple-50">
                  <tr>
                    {["Category","Month","Budget","Spent","Remaining","Status","Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-purple-400 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enrichedBudgets.map((b, i) => {
                    const remaining = b.amount - b.spent;
                    const isOver    = b.spent > b.amount;
                    const pct       = b.amount > 0 ? Math.round((b.spent / b.amount) * 100) : 0;
                    return (
                      <tr key={b.id} className={`hover:bg-purple-50/50 transition-colors ${i < enrichedBudgets.length - 1 ? "border-b border-purple-50" : ""}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(b.category) }} />
                            <span className="text-sm text-gray-700 font-medium truncate">{b.category}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{b.month}</td>
                        <td className="px-5 py-4 font-semibold text-gray-800">{fmt(b.amount)}</td>
                        <td className="px-5 py-4">
                          <span className={`font-semibold text-sm ${isOver ? "text-rose-600" : "text-gray-700"}`}>
                            {fmt(b.spent)}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">({pct}%)</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={remaining < 0 ? "text-rose-600 font-semibold" : "text-emerald-600 font-semibold"}>
                            {remaining < 0 ? "-" : ""}{fmt(Math.abs(remaining))}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                            isOver ? "bg-rose-100 text-rose-700"
                            : pct > 80 ? "bg-orange-100 text-orange-700"
                            : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {isOver ? "! Over Budget" : pct > 80 ? "⚡ Near Limit" : "✓ On Track"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleDelete(b.id)}
                            className="text-rose-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors" title="Delete">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
