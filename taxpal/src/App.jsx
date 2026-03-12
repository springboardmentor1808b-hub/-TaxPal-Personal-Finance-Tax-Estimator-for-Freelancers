import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home               from "./pages/Home";
import Login              from "./pages/Login";
import SignUp             from "./pages/SignUp";
import Logout             from "./pages/Logout";
import Dashboard          from "./pages/Dashboard";
import Transactions       from "./pages/Transactions";
import Budgets            from "./pages/Budgets";
import TaxEstimator       from "./pages/TaxEstimator";
import Reports            from "./pages/Reports";
import SettingCategories  from "./pages/SettingCategories";

import { TransactionProvider } from "./context/TransactionContext";
import { CategoryProvider }    from "./context/CategoryContext";

function App() {
  return (
    <BrowserRouter>
      <CategoryProvider>
        <TransactionProvider>
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/login"               element={<Login />} />
            <Route path="/signup"              element={<SignUp />} />
            <Route path="/logout"              element={<Logout />} />

            <Route path="/dashboard"           element={<Dashboard />} />
            <Route path="/transactions"        element={<Transactions />} />
            <Route path="/budgets"             element={<Budgets />} />
            <Route path="/tax-estimator"       element={<TaxEstimator />} />
            <Route path="/reports"             element={<Reports />} />
            <Route path="/settings/categories" element={<SettingCategories />} />
          </Routes>
        </TransactionProvider>
      </CategoryProvider>
    </BrowserRouter>
  );
}

export default App;