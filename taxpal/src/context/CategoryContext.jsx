
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

/* ─── Preset colors for category dots ───────────────────────────────── */
export const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#64748b",
];

const DEFAULT_EXPENSE_CATEGORIES = [
  { id: "exp-1", name: "Business Expenses", type: "expense", color: "#6366f1" },
  { id: "exp-2", name: "Office Rent", type: "expense", color: "#8b5cf6" },
  { id: "exp-3", name: "Software Subscriptions", type: "expense", color: "#ec4899" },
  { id: "exp-4", name: "Professional Development", type: "expense", color: "#f43f5e" },
  { id: "exp-5", name: "Marketing", type: "expense", color: "#f97316" },
  { id: "exp-6", name: "Travel", type: "expense", color: "#22c55e" },
  { id: "exp-7", name: "Meals & Entertainment", type: "expense", color: "#14b8a6" },
  { id: "exp-8", name: "Utilities", type: "expense", color: "#3b82f6" },
];

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  // load categories from backend when token available/changes
  useEffect(() => {
    if (!authToken) {
      console.warn('no auth token, skipping categories fetch');
      return;
    }

    (async () => {
      try {
        const res = await api('/api/categories');
        const data = await res.json();
        if (res.ok) {
          const cats = data.categories.map((c) => ({ ...c, id: c._id }));
          setExpenseCategories(cats.filter((c) => c.type === 'expense'));
          setIncomeCategories(cats.filter((c) => c.type === 'income'));
        } else {
          console.error('failed to load categories', data.message);
        }
      } catch (err) {
        console.error('error fetching categories', err);
      }
    })();
  }, [authToken]);

  const refreshCategories = () => {
    setAuthToken(localStorage.getItem('token'));
  };

  const addCategory = async (category) => {
    try {
      const res = await api('/api/categories', {
        method: 'POST',
        body: JSON.stringify(category),
      });
      const data = await res.json();
      if (res.ok) {
        const n = { ...data.category, id: data.category._id };
        if (n.type === 'expense') setExpenseCategories((prev) => [...prev, n]);
        else setIncomeCategories((prev) => [...prev, n]);
      } else {
        console.error('add category failed', data.message);
        alert('Could not add category: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error adding category');
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const res = await api(`/api/categories/${id}`, {
        method: 'PUT',
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
        console.error('update category failed', data.message);
        alert('Could not update category: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating category');
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await api(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExpenseCategories((prev) => prev.filter((c) => c.id !== id));
        setIncomeCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        console.error('delete category failed', data.message);
        alert('Could not delete category: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting category');
    }
  };

  const getExpenseCategoryNames = () => expenseCategories.map((c) => c.name);
  const getIncomeCategoryNames = () => incomeCategories.map((c) => c.name);

  const getCategoryColor = (name) => {
    const exp = expenseCategories.find((c) => c.name === name);
    const inc = incomeCategories.find((c) => c.name === name);
    return exp?.color || inc?.color || "#64748b";
  };

  return (
    <CategoryContext.Provider
      value={{
        expenseCategories,
        incomeCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        getExpenseCategoryNames,
        getIncomeCategoryNames,
        getCategoryColor,
        refreshCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    throw new Error("useCategories must be used within CategoryProvider");
  }
  return ctx;
}
