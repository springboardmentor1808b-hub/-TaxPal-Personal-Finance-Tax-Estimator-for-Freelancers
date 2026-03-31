
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Landing from "./components/pages/Landing";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Dashboard from "./components/pages/Dashboard";
import IncomeForm from "./components/pages/IncomeForm";
import ExpenseForm from "./components/pages/ExpenseForm";
import Budget from "./components/pages/Budget";
import TransactionPage from "./components/pages/Transactions"; 
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/pages/Profile";
import TaxEstimator from "./components/pages/TaxEstimator";
import TaxCalendar from "./components/pages/TaxCalendar";
<<<<<<< HEAD

=======
import Reports from "./components/pages/Reports";
>>>>>>> c227d919a9a7a12e0716f4189022303f094cb7d8
function App() {
  const isAuthenticated = localStorage.getItem("token");

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

        {/* ✅ New Transaction History Route */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionPage />
            </ProtectedRoute>
          }
        />

        <Route
<<<<<<< HEAD
=======
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
>>>>>>> c227d919a9a7a12e0716f4189022303f094cb7d8
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

        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          }
        />
              <Route
              path="/tax-estimator"
              element={
              <ProtectedRoute>
              <TaxEstimator />
             </ProtectedRoute>
           }
        />
        <Route path="/tax-calendar" element={<TaxCalendar />} />


            <Route
            path="/profile"
            element={
            <ProtectedRoute>
              <Profile />
              </ProtectedRoute>
            }
           />

        {/* Fallback */}
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;