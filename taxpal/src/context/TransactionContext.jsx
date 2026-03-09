// @refresh reset
import { createContext, useContext, useState, useEffect } from "react";

const CURRENCY_MAP = {
  "India": { code: "INR", locale: "en-IN", symbol: "₹" },
  "UK":    { code: "GBP", locale: "en-GB", symbol: "£" },
  "USA":   { code: "USD", locale: "en-US", symbol: "$" },
};

function getCurrency() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const country = user?.country || "India";
    return CURRENCY_MAP[country] || CURRENCY_MAP["India"];
  } catch {
    return CURRENCY_MAP["India"];
  }
}

const TransactionContext = createContext(null);

import { api } from '../utils/api';

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  // whenever authToken changes we re-fetch transactions
  useEffect(() => {
    if (!authToken) {
      console.warn('no auth token, skipping transactions fetch');
      return;
    }

    (async () => {
      try {
        const res = await api('/api/transactions');
        const data = await res.json();
        if (res.ok) {
          const norm = data.transactions.map((tx) => ({ ...tx, id: tx._id }));
          setTransactions(norm);
        } else {
          console.error('failed to fetch transactions', data.message);
        }
      } catch (err) {
        console.error('error fetching transactions', err);
      }
    })();
  }, [authToken]);

  // helper to refresh token state (e.g. after login)
  const refreshTransactions = () => {
    setAuthToken(localStorage.getItem('token'));
  };

  const currency = getCurrency();

  const fmt = (n) =>
    new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: 0,
    }).format(Number(n));

  const addTransaction = async (tx) => {
    try {
      const res = await api('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(tx),
      });
      const data = await res.json();
      if (res.ok) {
        const n = { ...data.transaction, id: data.transaction._id };
        setTransactions((prev) => [n, ...prev]);
      } else {
        console.error('add transaction failed', data.message);
        alert('Could not add transaction: ' + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const res = await api(`/api/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } else {
        const data = await res.json();
        console.error('delete transaction failed', data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, fmt, currency, refreshTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}
