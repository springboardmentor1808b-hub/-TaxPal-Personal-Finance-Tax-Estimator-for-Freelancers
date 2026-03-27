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
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Info
} from "lucide-react";

const TaxCalendar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2025-26");

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/tax/reminders?financialYear=${selectedYear}`);
        if (res.data.success) {
          const formattedEvents = res.data.reminders.map((r) => ({
            id: r._id,
            title: `${r.quarter} Advance Tax`,
            dueDate: new Date(r.dueDate),
            amount: r.totalPayableToday,
            status: r.status,
            daysLeft: Math.ceil((new Date(r.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch tax reminders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, [selectedYear]);

  // UI Config based on logic
  const getStatusInfo = (status, daysLeft) => {
    if (status === "Paid") {
      return { 
        bg: "bg-green-50", border: "border-green-100", text: "text-green-600", 
        icon: <CheckCircle2 size={18}/>, label: "Settled", 
        detail: "This installment is fully paid." 
      };
    }
    if (daysLeft < 0) {
      return { 
        bg: "bg-red-50", border: "border-red-100", text: "text-red-600", 
        icon: <ShieldAlert size={18}/>, label: "Overdue", 
        detail: `Critical: Late by ${Math.abs(daysLeft)} days. Interest may apply.` 
      };
    }
    return { 
      bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600", 
      icon: <Clock size={18}/>, label: "Pending", 
      detail: `Action required within ${daysLeft} days.` 
    };
  };

  return (
    <div className="flex min-h-screen bg-[#fdfaf5]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1a1a1a] flex flex-col fixed h-full shadow-lg">
        <div className="p-8">
          <h1 className="text-3xl font-black italic text-white">Tax<span className="text-[#ff4d00]">Pal</span></h1>
        </div>
        <nav className="flex-1 px-3 mt-2 space-y-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => navigate("/dashboard")} />
          <NavItem icon={<ArrowLeftRight size={20}/>} label="Transactions" onClick={() => navigate("/transactions")} />
          <NavItem icon={<Wallet size={20}/>} label="Budgets" onClick={() => navigate("/budgets")} />
          <NavItem icon={<Calculator size={20}/>} label="Tax Estimator" onClick={() => navigate("/tax-estimator")} />
          <NavItem icon={<CalendarDays size={20}/>} label="Tax Calendar" active />
          <NavItem icon={<BarChart3 size={20}/>} label="Reports" onClick={()=>navigate("/reports")} />
          <NavItem icon={<User size={20}/>} label="Profile" onClick={() => navigate("/profile")} />
        </nav>
        <div className="p-4 border-t border-white/10">
           <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="flex items-center gap-2 text-sm text-gray-400">
              <LogOut size={16}/> Logout
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-slate-800">Tax Deadlines</h1>
              <p className="text-slate-400 text-sm mt-1 font-medium italic">Track your quarterly tax compliance</p>
            </div>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border-none shadow-sm text-sm font-bold rounded-xl px-4 py-2 cursor-pointer focus:ring-2 focus:ring-[#ff4d00]/20"
            >
              <option value="2025-26">FY 2025-26</option>
              <option value="2024-25">FY 2024-25</option>
            </select>
          </header>

          {/* SYSTEM ALERT BAR */}
          {events.some(e => e.daysLeft < 7 && e.status !== "Paid") && (
            <div className="mb-8 bg-white border-l-4 border-red-500 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="bg-red-100 p-2 rounded-full text-red-600"><AlertCircle size={20} /></div>
              <div>
                <p className="font-bold text-slate-800">Payment Alert</p>
                <p className="text-sm text-slate-500 font-medium">One or more installments are nearing the deadline. Review details below.</p>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {loading ? (
              <p className="text-center text-slate-400 py-10">Syncing with estimator...</p>
            ) : (
              events.map((event, index) => {
                const config = getStatusInfo(event.status, event.daysLeft);
                return (
                  <div key={index} className="bg-white border border-slate-100 rounded-3xl p-6 transition-all hover:border-[#ff4d00]/30 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-5">
                        <div className={`p-4 rounded-2xl ${config.bg} ${config.text}`}>
                          {config.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-extrabold text-slate-800">{event.title}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.border} ${config.text}`}>
                              {config.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium">
                            Due: {event.dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Estimated Tax</p>
                        <p className="text-xl font-black text-slate-800">
                          ₹{Math.round(event.amount).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* DETAIL INFO BOX */}
                    <div className={`mt-5 p-3 rounded-xl flex items-center gap-2 border border-dashed ${config.border} ${config.bg} ${config.text} text-xs font-semibold`}>
                      <Info size={14} />
                      {config.detail}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 px-5 py-3 rounded-xl cursor-pointer transition-all ${
      active ? "bg-[#ff4d00] text-white shadow-md shadow-[#ff4d00]/20" : "text-gray-400 hover:text-white hover:bg-white/5"
    }`}
  >
    {icon}
    <span className="text-sm font-bold">{label}</span>
  </div>
);

export default TaxCalendar;