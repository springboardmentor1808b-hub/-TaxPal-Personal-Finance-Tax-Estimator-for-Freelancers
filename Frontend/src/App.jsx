import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import LandingPage from './Pages/LandingPage'; 

import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';

import DashboardLayout from './Components/DashboardLayout';
import Dashboard from './Pages/Dashboard'; 
import Transactions from './Pages/Transactions';
import Budgets from './Pages/Budgets';
import TaxEstimator from './Pages/TaxEstimator';
import Reports from './Pages/Reports';




function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* NEW ROUTES */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* The :token part is crucial - it acts as a variable */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Dashboard Routes wrapped inside DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />        
          <Route path="/transactions" element={<Transactions />} />        
          <Route path="/budgets" element={<Budgets />} />        
          <Route path="/tax-estimator" element={<TaxEstimator />} />        
          <Route path="/reports" element={<Reports />} />        
        </Route>        
      </Routes>
    </div>
  );
}



export default App
