import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './components/Dashboard/Dashboard'
import IncomeForm from './components/Transaction/IncomeForm'
import ExpenseForm from './components/Transaction/ExpenseForm'

function App() {
  return (
    <Router>
      <Routes>
        {/* Shuruat mein Register page dikhega */}
        <Route path="/" element={<Register />} /> 
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard & Forms */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-income" element={<IncomeForm />} />
        <Route path="/add-expense" element={<ExpenseForm />} />
      </Routes>
    </Router>
  )
}

export default App