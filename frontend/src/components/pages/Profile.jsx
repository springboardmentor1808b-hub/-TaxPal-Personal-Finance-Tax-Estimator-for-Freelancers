import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Calculator,
  BarChart3,
  LogOut
} from "lucide-react";

const Profile = () => {

  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "Not Provided",
    address: user?.address || "Not Provided"
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (

    <div className="flex min-h-screen bg-[#fdfaf5] font-sans text-slate-700">

      {/* SIDEBAR */}

      <aside className="w-64 bg-[#1a1a1a] flex flex-col fixed h-full shadow-2xl">

        <div className="p-8">
          <h1 className="text-3xl font-black italic text-white">
            Tax<span className="text-[#ff4d00]">Pal</span>
          </h1>
        </div>

        <nav className="flex-1 px-3 mt-2 space-y-1">

          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />

          <NavItem
            icon={<ArrowLeftRight size={20} />}
            label="Transactions"
            onClick={() => navigate("/transactions")}
          />

          <NavItem
            icon={<Wallet size={20} />}
            label="Budgets"
            onClick={() => navigate("/budgets")}
          />

          <NavItem
            icon={<Calculator size={20} />}
            label="Tax Estimator"
            onClick={() => navigate("/tax-estimator")}
          />

          <NavItem
            icon={<CalendarDays size={20} />}
            label="Tax Calendar"
            onClick={() => navigate("/tax-calendar")}
          />

          <NavItem
            icon={<BarChart3 size={20} />}
            label="Reports"
            onClick={() => navigate("/reports")}
          />

          <NavItem
            icon={<User size={20} />}
            label="Profile"
            active
            onClick={() => navigate("/profile")}
          />

        </nav>

        {/* USER PROFILE */}

        <div className="p-3 border-t border-white/10">

          <div className="flex items-center gap-2 mb-3 text-white">

            <div className="w-8 h-8 bg-[#ff4d00] rounded-full flex items-center justify-center text-sm font-semibold">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {user?.email}
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#ff4d00] transition-colors"
          >
            <LogOut size={14}/> Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="flex-1 ml-64 p-10">

        <header className="mb-10">
          <h2 className="text-4xl font-black text-[#1a1a1a]">
            My Profile
          </h2>
          <p className="text-gray-500">
            View and update your personal details.
          </p>
        </header>

        <div className="max-w-4xl bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="h-32 bg-gradient-to-r from-[#1a1a1a] to-[#333]"></div>

          <div className="p-8 relative">

            <div className="absolute -top-16 left-8">

              <div className="w-32 h-32 bg-[#ff4d00] rounded-2xl border-4 border-white flex items-center justify-center shadow-xl">

                <span className="text-5xl font-black text-white uppercase">
                  {user?.firstName?.charAt(0)}
                </span>

              </div>

            </div>

            <div className="mt-16 flex justify-between items-start">

              <div>

                <h3 className="text-3xl font-black text-[#1a1a1a]">
                  {formData.firstName} {formData.lastName}
                </h3>

                <p className="text-gray-500 font-medium capitalize">
                  {user?.role || "Member"} User
                </p>

              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-[#fdfaf5] border border-gray-200 px-5 py-2 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >

                {isEditing ? <Save size={18}/> : <Edit3 size={18}/>}

                {isEditing ? "Save Profile" : "Edit Profile"}

              </button>

            </div>

            <hr className="my-8 border-gray-50"/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <ProfileField
                icon={<User className="text-[#ff4d00]" size={20}/>}
                label="Full Name"
                value={
                  isEditing
                    ? (
                      <input
                        className="bg-white border rounded p-1 w-full"
                        value={`${formData.firstName} ${formData.lastName}`}
                        readOnly
                      />
                    )
                    : `${formData.firstName} ${formData.lastName}`
                }
              />

              <ProfileField
                icon={<Mail className="text-[#ff4d00]" size={20}/>}
                label="Email Address"
                value={formData.email}
              />

              <ProfileField
                icon={<Phone className="text-[#ff4d00]" size={20}/>}
                label="Phone Number"
                value={formData.phone}
              />

              <ProfileField
                icon={<MapPin className="text-[#ff4d00]" size={20}/>}
                label="Location"
                value={formData.address}
              />

            </div>

          </div>

        </div>

      </main>

    </div>

  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (

  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-[#ff4d00] text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-700/40"
    }`}
  >

    {icon}

    <span className="text-sm">
      {label}
    </span>

  </div>

);

const ProfileField = ({ icon, label, value }) => (

  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">

    <div className="p-3 bg-white rounded-xl shadow-sm">
      {icon}
    </div>

    <div>

      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
        {label}
      </p>

      <div className="text-lg font-bold text-[#1a1a1a]">
        {value}
      </div>

    </div>

  </div>

);

export default Profile;