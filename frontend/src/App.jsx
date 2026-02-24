import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./components/pages/Landing";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Dashboard from "./components/pages/Dashboard";
import IncomeForm from "./components/pages/IncomeForm";
import ExpenseForm from "./components/pages/ExpenseForm";
import Budget from "./components/pages/Budget";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <IncomeForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expense"
          element={
            <ProtectedRoute>
              <ExpenseForm />
            </ProtectedRoute>
          }
        />

        {/* Budget Route */}
        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          }
        />

        {/* If route not found → go to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>
    </Router>
  );
}

export default App;