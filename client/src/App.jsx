import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Placeholder from "./pages/PlaceHolder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Placeholder title="Transactions" icon="💸" />} />
        <Route path="/calendar" element={<Placeholder title="Tax Calendar" icon="📅" />} />
        <Route path="/documents" element={<Placeholder title="Documents" icon="📂" />} />
        <Route path="/settings" element={<Placeholder title="Settings" icon="⚙️" />} />
        <Route path="*" element={<Placeholder title="Page Not Found" icon="🔍" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
