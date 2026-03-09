
// src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navItems = [
    { path: "/dashboard",     label: "Dashboard" },
    { path: "/budgets",       label: "Budgets" },
    { path: "/transactions",  label: "Transactions" },
    // no Categories in main sidebar
    { path: "/tax-estimator", label: "Tax Estimator" },
    { path: "#",              label: "Reports" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg p-6 hidden md:flex flex-col border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <Link to="/" className="block">
        <h2 className="text-2xl font-bold mb-10 text-gray-800">TaxPal</h2>
      </Link>

      {/* Nav Links */}
      <ul className="space-y-6 text-gray-600 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const content = (
            <span
              className={`block hover:translate-x-1 transition-all ${
                isActive
                  ? "text-purple-600 font-semibold"
                  : "hover:text-purple-600"
              }`}
            >
              {item.label}
            </span>
          );
          return (
            <li key={item.label} className="cursor-pointer">
              {item.path !== "#" ? <Link to={item.path}>{content}</Link> : content}
            </li>
          );
        })}
      </ul>

      {/* Bottom section — user info + logout */}
      <div className="border-t border-gray-100 pt-4 mt-6">
        {/* User details (click to open settings/categories) */}
        <button
          onClick={() => navigate("/settings/categories")}
          className="w-full flex items-center gap-3 mb-4 text-left hover:bg-purple-50 rounded-lg px-2 py-2 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || ""}
            </p>
          </div>
        </button>

        {/* Logout button */}
        <button
          onClick={() => navigate("/logout")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
 