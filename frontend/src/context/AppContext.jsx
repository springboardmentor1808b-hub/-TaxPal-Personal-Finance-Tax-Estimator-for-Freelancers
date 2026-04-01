import React, { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [transactions, setTransactions] = useState([
        { id: 1, label: "Design Project", date: "May 08, 2025", category: "Consulting", flow: 3120, group: "INCOME" },
        { id: 2, label: "Adobe Creative Cloud", date: "May 12, 2025", category: "Software", flow: 54.99, group: "EXPENSE" },
        { id: 3, label: "Client Payment - Web Design", date: "May 10, 2025", category: "Consulting", flow: 3500, group: "INCOME" },
        { id: 4, label: "Coworking Space", date: "May 08, 2025", category: "Office", flow: 300, group: "EXPENSE" },
        { id: 5, label: "DigitalOcean Hosting", date: "May 05, 2025", category: "Software", flow: 24, group: "EXPENSE" },
        { id: 6, label: "Freelance - Logo Design", date: "Apr 28, 2025", category: "Design", flow: 850, group: "INCOME" },
        { id: 7, label: "Office Supplies", date: "Apr 25, 2025", category: "Office", flow: 95, group: "EXPENSE" },
        { id: 8, label: "Monthly Retainer", date: "Apr 01, 2025", category: "Consulting", flow: 2000, group: "INCOME" },
        { id: 9, label: "Rent / Mortgage", date: "May 01, 2025", category: "Rent", flow: 1800, group: "EXPENSE" },
        { id: 10, label: "Travel - Client Visit", date: "Apr 18, 2025", category: "Travel", flow: 420, group: "EXPENSE" },
    ]);

    const [budgets, setBudgets] = useState([
        { id: 1, name: "Marketing", spent: 1200, limit: 2000, color: "#6366f1" },
        { id: 2, name: "Software", spent: 79, limit: 500, color: "#3b82f6" },
        { id: 3, name: "Office & Rent", spent: 1800, limit: 1800, color: "#10b981" },
        { id: 4, name: "Travel", spent: 420, limit: 1000, color: "#f59e0b" },
    ]);

    const [expenseCategories, setExpenseCategories] = useState([
        { id: 1, name: 'Business Expenses', color: '#6366f1' },
        { id: 2, name: 'Office Rent', color: '#10b981' },
        { id: 3, name: 'Software Subscriptions', color: '#3b82f6' },
        { id: 4, name: 'Professional Development', color: '#f59e0b' },
        { id: 5, name: 'Marketing', color: '#ec4899' },
        { id: 6, name: 'Travel', color: '#0ea5e9' },
        { id: 7, name: 'Meals & Entertainment', color: '#a855f7' },
        { id: 8, name: 'Utilities', color: '#64748b' },
    ]);

    const [incomeCategories, setIncomeCategories] = useState([
        { id: 1, name: 'Consulting', color: '#10b981' },
        { id: 2, name: 'Freelance', color: '#6366f1' },
        { id: 3, name: 'Design', color: '#f59e0b' },
        { id: 4, name: 'Salary', color: '#3b82f6' },
    ]);

    const [taxCalculations, setTaxCalculations] = useState([]);

    const summary = useMemo(() => {
        const totalIncome = transactions
            .filter(t => t.group === "INCOME")
            .reduce((s, t) => s + t.flow, 0);
        const totalExpenses = transactions
            .filter(t => t.group === "EXPENSE")
            .reduce((s, t) => s + t.flow, 0);
        const netEarnings = totalIncome - totalExpenses;
        const estTax = netEarnings * 0.275; // ~27.5% self-employment tax estimate
        return { totalIncome, totalExpenses, netEarnings, estTax };
    }, [transactions]);

    const addTransaction = (tx) => {
        const newTx = { ...tx, id: Date.now() };
        setTransactions(prev => [newTx, ...prev]);
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const addBudget = (budget) => {
        setBudgets(prev => [...prev, { ...budget, id: Date.now(), spent: 0 }]);
    };

    const deleteBudget = (id) => {
        setBudgets(prev => prev.filter(b => b.id !== id));
    };

    const addExpenseCategory = (cat) => {
        setExpenseCategories(prev => [...prev, { ...cat, id: Date.now() }]);
    };

    const deleteExpenseCategory = (id) => {
        setExpenseCategories(prev => prev.filter(c => c.id !== id));
    };

    const addIncomeCategory = (cat) => {
        setIncomeCategories(prev => [...prev, { ...cat, id: Date.now() }]);
    };

    const deleteIncomeCategory = (id) => {
        setIncomeCategories(prev => prev.filter(c => c.id !== id));
    };

    const addTaxCalculation = (calc) => {
        setTaxCalculations(prev => [{ ...calc, id: Date.now(), savedAt: new Date().toLocaleDateString() }, ...prev]);
    };

    return (
        <AppContext.Provider value={{
            transactions, addTransaction, deleteTransaction,
            budgets, addBudget, deleteBudget,
            expenseCategories, addExpenseCategory, deleteExpenseCategory,
            incomeCategories, addIncomeCategory, deleteIncomeCategory,
            taxCalculations, addTaxCalculation,
            summary,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be inside AppProvider');
    return ctx;
}
