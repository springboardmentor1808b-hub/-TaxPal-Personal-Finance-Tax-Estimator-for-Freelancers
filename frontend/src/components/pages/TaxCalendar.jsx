import React, { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Calculator,
  CalendarDays,
  BarChart3,
  User,
  LogOut,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Info,
  CheckSquare
} from "lucide-react";

const TaxCalendar = () => {
  const navigate = useNavigate();
  
  // User data for the sidebar profile section
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2025-26");

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/tax/reminders?financialYear=${selectedYear}`);
      if (res.data.success) {
        const formattedEvents = res.data.reminders.map((r) => ({
          id: r.id,
          title: `${r.quarter} Advance Tax`,
          dueDate: new Date(r.dueDate),
          amount: r.totalPayableToday,
          status: r.status,
          daysLeft: Math.ceil((new Date(r.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [selectedYear]);

  const handleMarkAsPaid = async (event) => {
    if (!event.id) {
      alert("Error: Record ID missing. Please recalculate tax in Estimator.");
      return;
    }

    const confirmAction = window.confirm(`Confirm payment of ₹${Math.round(event.amount)}?`);
    
    if (confirmAction) {
      try {
        const res = await API.post(`/tax/pay/${event.id}`, { 
          amountPaid: event.amount 
        });

        if (res.data.success) {
          alert("Tax status updated successfully!");
          fetchReminders();
        }
      } catch (error) {
        alert(error.response?.data?.message || "Update failed");
      }
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Paid") return { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", icon: <CheckCircle2 size={18}/> };
    if (status === "Overdue") return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: <ShieldAlert size={18}/> };
    return { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", icon: <Clock size={18}/> };
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
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => navigate("/dashboard")} />
          <NavItem icon={<ArrowLeftRight size={20} />} label="Transactions" onClick={() => navigate("/transactions")} />
          <NavItem icon={<Wallet size={20} />} label="Budgets" onClick={() => navigate("/budgets")} />
          <NavItem icon={<Calculator size={20} />} label="Tax Estimator" onClick={() => navigate("/tax-estimator")} />
          <NavItem icon={<CalendarDays size={20} />} label="Tax Calendar" active onClick={() => navigate("/tax-calendar")} />
          <NavItem icon={<BarChart3 size={20} />} label="Reports" onClick={() => navigate("/reports")} />
          <NavItem icon={<User size={20} />} label="Profile" onClick={() => navigate("/profile")} />
        </nav>

        {/* USER PROFILE SECTION */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3 text-white">
            <div className="w-8 h-8 bg-[#ff4d00] rounded-full flex items-center justify-center text-sm font-semibold text-white">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
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
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#ff4d00] transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-slate-800">Tax Calendar</h1>
              <p className="text-slate-400 text-sm font-medium italic">Quarterly Compliance Tracking</p>
            </div>
            
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border p-3 rounded-xl shadow-sm text-sm font-bold outline-none focus:ring-2 focus:ring-[#ff4d00]/20 cursor-pointer"
            >
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
            </select>
          </header>

          <div className="grid gap-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-center font-bold animate-pulse text-slate-400">Syncing records...</p>
              </div>
            ) : events.length > 0 ? (
              events.map((event, index) => {
                const style = getStatusStyle(event.status);
                const isPaid = event.status === "Paid";

                return (
                  <div 
                    key={index} 
                    className={`bg-white border-2 ${isPaid ? 'border-green-100' : 'border-slate-50'} rounded-3xl p-6 shadow-sm transition-all hover:shadow-md`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className={`p-4 rounded-2xl ${style.bg} ${style.text}`}>
                          {style.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-extrabold text-slate-800">{event.title}</h3>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${style.border} ${style.text}`}>
                              {event.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium italic">
                            Due Date: {event.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Amount Payable</p>
                        <p className={`text-2xl font-black ${isPaid ? 'text-green-500' : 'text-slate-800'}`}>
                          ₹{isPaid ? "0" : Math.round(event.amount).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-50 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Info size={14} />
                        {isPaid 
                          ? "Payment recorded in our database." 
                          : `Deadline approaching. Settle to avoid further interest.`}
                      </div>
                      {!isPaid && (
                        <button 
                          onClick={() => handleMarkAsPaid(event)}
                          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#ff4d00] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-lg"
                        >
                          <CheckSquare size={14} /> Mark as Paid
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No tax estimates found for this year.</p>
                <button 
                  onClick={() => navigate("/tax-estimator")}
                  className="mt-4 text-[#ff4d00] text-sm font-black underline"
                >
                  Go to Estimator
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// NavItem matching Tax Estimator font logic
const NavItem = ({ icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20"
        : "text-gray-400 hover:text-white hover:bg-gray-700/40"
    }`}
  >
    {icon}
    {/* Using font-medium instead of font-bold for a cleaner, consistent look */}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default TaxCalendar;