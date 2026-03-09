
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext";
import { TransactionProvider } from "./context/TransactionContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Budgets from "./pages/Budgets";
import Transactions from "./pages/Transactions";
import SettingLayout from "./pages/SettingLayout";
import SettingsProfile from "./pages/SettingsProfile";
import SettingCategories from "./pages/SettingCategories";
import SettingsNotifications from "./pages/SettingsNotifications";
import SettingsSecurity from "./pages/SettingsSecurity";
import TaxEstimator from "./pages/TaxEstimator";

function App() {
  return (
    <CategoryProvider>
      <TransactionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/tax-estimator" element={<TaxEstimator />} />

            {/* Settings layout with internal sidebar (used by overlay) */}
            <Route path="/settings" element={<SettingLayout />}>
              <Route
                index
                element={<Navigate to="/settings/categories" replace />}
              />
              <Route path="profile" element={<SettingsProfile />} />
              <Route path="categories" element={<SettingCategories />} />
              <Route
                path="notifications"
                element={<SettingsNotifications />}
              />
              <Route path="security" element={<SettingsSecurity />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TransactionProvider>
    </CategoryProvider>
  );
}

export default App;
