import { Link, Outlet, useLocation } from "react-router-dom";

const SETTINGS_ITEMS = [
  { path: "/settings/profile", label: "Profile" },
  { path: "/settings/categories", label: "Categories" },
  { path: "/settings/notifications", label: "Notifications" },
  { path: "/settings/security", label: "Security" },
];

export default function SettingsLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Settings left sidebar */}
      <div className="w-56 bg-white shadow-sm border-r border-purple-100 p-6 shrink-0">
        <Link to="/" className="block mb-2">
          <h2 className="text-2xl font-bold text-gray-800">TaxPal</h2>
        </Link>
        <Link
          to="/dashboard"
          className="block text-gray-500 hover:text-purple-600 mb-8 text-sm font-medium"
        >
          ← Back to Dashboard
        </Link>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Settings
        </h3>
        <ul className="space-y-1">
          {SETTINGS_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Content area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
