// @refresh reset
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

const CURRENCY_MAP = {
  "India": { code: "INR", locale: "en-IN", symbol: "₹" },
  "UK":    { code: "GBP", locale: "en-GB", symbol: "£" },
  "USA":   { code: "USD", locale: "en-US", symbol: "$" },
};

function getCurrency() {
  try {
    const user    = JSON.parse(localStorage.getItem("user") || "{}");
    const country = user?.country || user?.Country || user?.COUNTRY || "";
    const c = country.toString().toLowerCase().trim();
    if (c === "uk" || c.includes("united kingdom") || c.includes("britain"))
      return CURRENCY_MAP["UK"];
    if (c === "usa" || c.includes("united states") || c.includes("america"))
      return CURRENCY_MAP["USA"];
    if (c === "india" || c.includes("ind"))
      return CURRENCY_MAP["India"];
    if (CURRENCY_MAP[country]) return CURRENCY_MAP[country];
    return CURRENCY_MAP["India"];
  } catch {
    return CURRENCY_MAP["India"];
  }
}

const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [budgets,      setBudgets]      = useState([]);
  const [loading,      setLoading]      = useState(false);

  const currency = getCurrency();

  const fmt = (n) =>
    new Intl.NumberFormat(currency.locale, {
      style:                 "currency",
      currency:              currency.code,
      maximumFractionDigits: 0,
    }).format(Number(n));

  // ── Fetch transactions from backend ───────────────────────────────
  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const res  = await api("/api/transactions");
      const data = await res.json();
      if (res.ok && data.transactions) {
        const normalized = data.transactions.map((t) => ({
          ...t,
          id: t._id || t.id,
        }));
        setTransactions(normalized);
      }
    } catch (err) {
      console.error("[TaxPal] Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // ── Add transaction — save to backend then update local state ─────
  const addTransaction = async (tx) => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No backend — just add locally
      setTransactions(prev => [{ ...tx, id: Date.now() }, ...prev]);
      return;
    }
    try {
      const res  = await api("/api/transactions", {
        method: "POST",
        body:   JSON.stringify(tx),
      });
      const data = await res.json();
      if (res.ok && data.transaction) {
        const saved = { ...data.transaction, id: data.transaction._id || data.transaction.id };
        setTransactions(prev => [saved, ...prev]);
      } else {
        // Fallback: add locally if backend fails
        setTransactions(prev => [{ ...tx, id: Date.now() }, ...prev]);
      }
    } catch {
      // Fallback: add locally
      setTransactions(prev => [{ ...tx, id: Date.now() }, ...prev]);
    }
  };

  // ── Delete transaction ─────────────────────────────────────────────
  const deleteTransaction = async (id) => {
    // Optimistic: remove from UI immediately
    setTransactions(prev => prev.filter(t => t.id !== id));
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await api(`/api/transactions/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("[TaxPal] Error deleting transaction:", err);
      // Re-fetch to restore correct state if delete failed
      fetchTransactions();
    }
  };

  const refreshTransactions = () => fetchTransactions();

  return (
    <TransactionContext.Provider value={{
      transactions, addTransaction, deleteTransaction,
      fmt, currency,
      budgets, setBudgets,
      loading, refreshTransactions,
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}