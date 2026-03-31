import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

/* ─── Preset colors ─────────────────────────────────────────────── */
export const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#64748b",
];

/* ─── Defaults shown immediately while API loads ─────────────────── */
const DEFAULT_EXPENSE_CATEGORIES = [
  { id: "exp-1", name: "Business Expenses",       type: "expense", color: "#6366f1" },
  { id: "exp-2", name: "Office Rent",              type: "expense", color: "#8b5cf6" },
  { id: "exp-3", name: "Software Subscriptions",   type: "expense", color: "#ec4899" },
  { id: "exp-4", name: "Professional Development", type: "expense", color: "#f43f5e" },
  { id: "exp-5", name: "Marketing",                type: "expense", color: "#f97316" },
  { id: "exp-6", name: "Travel",                   type: "expense", color: "#22c55e" },
  { id: "exp-7", name: "Meals & Entertainment",    type: "expense", color: "#14b8a6" },
  { id: "exp-8", name: "Utilities",                type: "expense", color: "#3b82f6" },
];

const DEFAULT_INCOME_CATEGORIES = [
  { id: "inc-1", name: "Salary",     type: "income", color: "#6366f1" },
  { id: "inc-2", name: "Freelance",  type: "income", color: "#8b5cf6" },
  { id: "inc-3", name: "Consulting", type: "income", color: "#22c55e" },
  { id: "inc-4", name: "Investment", type: "income", color: "#14b8a6" },
  { id: "inc-5", name: "Other",      type: "income", color: "#64748b" },
];

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  // ── Start with defaults so dropdowns are never empty ─────────────
  const [expenseCategories, setExpenseCategories] = useState(DEFAULT_EXPENSE_CATEGORIES);
  const [incomeCategories,  setIncomeCategories]  = useState(DEFAULT_INCOME_CATEGORIES);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("[TaxPal] No token — using default categories");
      return;
    }
    setLoading(true);
    try {
      const res  = await api("/api/categories");
      const data = await res.json();
      if (res.ok && data.categories?.length > 0) {
        const cats = data.categories.map((c) => ({ ...c, id: c._id }));
        const exp  = cats.filter((c) => c.type === "expense");
        const inc  = cats.filter((c) => c.type === "income");
        // Only replace defaults if backend actually returned categories
        if (exp.length > 0) setExpenseCategories(exp);
        if (inc.length > 0) setIncomeCategories(inc);
        console.log("[TaxPal] Loaded categories from backend:", cats.length);
      } else {
        console.warn("[TaxPal] No categories from backend, keeping defaults");
      }
    } catch (err) {
      console.error("[TaxPal] Error fetching categories, keeping defaults:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Also re-fetch if token appears after mount (e.g. login redirect)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && expenseCategories[0]?.id?.startsWith("exp-")) {
        // Still on defaults but token now exists — fetch real data
        fetchCategories();
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expenseCategories]);

  const refreshCategories = () => fetchCategories();

  const addCategory = async (category) => {
    try {
      const res  = await api("/api/categories", {
        method: "POST",
        body: JSON.stringify(category),
      });
      const data = await res.json();
      if (res.ok) {
        const n = { ...data.category, id: data.category._id };
        if (n.type === "expense") setExpenseCategories((prev) => [...prev, n]);
        else setIncomeCategories((prev) => [...prev, n]);
      } else {
        alert("Could not add category: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding category");
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const res  = await api(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        setExpenseCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
        );
        setIncomeCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
        );
      } else {
        alert("Could not update category: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating category");
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await api(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenseCategories((prev) => prev.filter((c) => c.id !== id));
        setIncomeCategories((prev)  => prev.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        alert("Could not delete category: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting category");
    }
  };

  const getCategoryColor = (name) => {
    const exp = expenseCategories.find((c) => c.name === name);
    const inc = incomeCategories.find((c) => c.name === name);
    return exp?.color || inc?.color || "#64748b";
  };

  const getExpenseCategoryNames = () => expenseCategories.map((c) => c.name);
  const getIncomeCategoryNames  = () => incomeCategories.map((c) => c.name);

  return (
    <CategoryContext.Provider value={{
      expenseCategories,
      incomeCategories,
      addCategory,
      updateCategory,
      deleteCategory,
      getExpenseCategoryNames,
      getIncomeCategoryNames,
      getCategoryColor,
      refreshCategories,
      loading,
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategories must be used within CategoryProvider");
  return ctx;
}