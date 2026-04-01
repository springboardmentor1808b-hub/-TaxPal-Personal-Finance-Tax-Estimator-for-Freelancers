
import React from "react";

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

  LogOut,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Info,
  CreditCard,
  History,
  X,
  ChevronDown

} from "lucide-react";

const TaxCalendar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="flex min-h-screen bg-[#fdfaf5]">

      {/* SIDEBAR (SAME STRUCTURE) */}
      <aside className="w-64 bg-[#1a1a1a] flex flex-col fixed h-full">

        <div className="p-8">
          <h1 className="text-3xl font-black italic text-white">
            Tax<span className="text-[#ff4d00]">Pal</span>
          </h1>
        </div>

        <nav className="flex-1 px-3 mt-2 space-y-1">

          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard"
            onClick={() => navigate("/dashboard")} />

          <NavItem icon={<ArrowLeftRight size={20}/>} label="Transactions"
            onClick={() => navigate("/transactions")} />

          <NavItem icon={<Wallet size={20}/>} label="Budgets"
            onClick={() => navigate("/budgets")} />

          <NavItem icon={<Calculator size={20}/>} label="Tax Estimator"
            onClick={() => navigate("/tax-estimator")} />

          <NavItem icon={<CalendarDays size={20}/>} label="Tax Calendar"
            active />

          <NavItem icon={<BarChart3 size={20}/>} label="Reports" />

          <NavItem icon={<User size={20}/>} label="Profile"
            onClick={() => navigate("/profile")} />

        </nav>

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
            onClick={() => {
            localStorage.clear();
            navigate("/login");
            }}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#ff4d00] transition-colors"
        >
            <LogOut size={14} /> Logout
        </button>
        </div>


  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2025-26");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
            daysLeft: Math.ceil((new Date(r.dueDate) - new Date()) / (1000 * 60 * 60 * 24)),
            paymentHistory: r.paymentHistory || []
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

  const handleMarkAsPaid = (event) => {
    setSelectedEvent(event);
    setPaymentAmount(Math.round(event.amount).toString());
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedEvent || !paymentAmount) return;

    setPaymentLoading(true);
    try {
      const res = await API.post(`/tax/pay/${selectedEvent.id}`, {
        amountPaid: parseFloat(paymentAmount)
      });

      if (res.data.success) {
        // Show success message
        setSuccessMessage(`Payment of ₹${parseFloat(paymentAmount).toLocaleString('en-IN')} recorded successfully!`);
        
        // Refresh the events
        const reminderRes = await API.get(`/tax/reminders?financialYear=${selectedYear}`);
        if (reminderRes.data.success) {
          const formattedEvents = reminderRes.data.reminders.map((r) => ({
            id: r._id,
            title: `${r.quarter} Advance Tax`,
            dueDate: new Date(r.dueDate),
            amount: r.totalPayableToday,
            status: r.status,
            daysLeft: Math.ceil((new Date(r.dueDate) - new Date()) / (1000 * 60 * 60 * 24)),
            paymentHistory: r.paymentHistory || []
          }));
          setEvents(formattedEvents);
        }
        
        setShowPaymentModal(false);
        setPaymentAmount("");
        setSelectedEvent(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleShowHistory = (event) => {
    setSelectedEvent(event);
    setShowHistoryModal(true);
  };

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
           <button onClick={() => { navigate("/login"); }} className="flex items-center gap-2 text-sm text-gray-400">
              <LogOut size={16}/> Logout
           </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-10">


        <h1 className="text-4xl font-black mb-6">
          Tax Calendar
        </h1>

        <div className="bg-white p-8 rounded-3xl shadow space-y-6">

          <h2 className="text-lg font-bold">June 2025</h2>

          <div className="border p-4 rounded-xl">
            <h3 className="font-semibold">Reminder: Q2 Estimated Tax Payment</h3>
            <p className="text-gray-500 text-sm">June 1, 2025</p>
            <p className="text-gray-600 text-sm">
              Reminder for upcoming Q2 estimated tax payment.
            </p>
          </div>

          <div className="border p-4 rounded-xl">
            <h3 className="font-semibold">Q2 Estimated Tax Payment</h3>
            <p className="text-gray-500 text-sm">June 15, 2025</p>
            <p className="text-gray-600 text-sm">
              Second quarter estimated tax payment due.
            </p>
          </div>

        </div>

      </main>

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
          {successMessage && (
            <div className="mb-8 bg-green-50 border-l-4 border-green-500 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 size={20} /></div>
              <div>
                <p className="font-bold text-green-800">Payment Successful</p>
                <p className="text-sm text-green-600 font-medium">{successMessage}</p>
              </div>
            </div>
          )}
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

                    {/* ACTION BUTTONS */}
                    <div className="mt-4 flex gap-3">
                      {event.status !== "Paid" && (
                        <button
                          onClick={() => handleMarkAsPaid(event)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#ff4d00] text-white text-xs font-bold rounded-xl hover:bg-[#e64400] transition-colors"
                        >
                          <CreditCard size={14} />
                          Mark as Paid
                        </button>
                      )}
                      <button
                        onClick={() => handleShowHistory(event)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <History size={14} />
                        Payment History
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* PAYMENT MODAL */}
      {showPaymentModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Mark as Paid</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-slate-600 mb-2">
                <strong>{selectedEvent.title}</strong>
              </p>
              <p className="text-xs text-slate-400">
                Due: {selectedEvent.dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-lg font-bold text-slate-800 mt-4">
                Due Amount: ₹{Math.round(selectedEvent.amount).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payment Amount (₹)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00]"
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePaymentSubmit}
                disabled={paymentLoading}
                className="flex-1 bg-[#ff4d00] text-white py-3 rounded-xl font-bold hover:bg-[#e64400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentLoading ? "Processing..." : "Confirm Payment"}
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentLoading}
                className="flex-1 bg-gray-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT HISTORY MODAL */}
      {showHistoryModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Payment History</h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-slate-600 mb-2">
                <strong>{selectedEvent.title}</strong>
              </p>
              <p className="text-xs text-slate-400">
                Due: {selectedEvent.dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Due:</span>
                  <span className="text-lg font-bold text-slate-800">
                    ₹{Math.round(selectedEvent.amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-slate-600">Status:</span>
                  <span className={`text-sm font-bold ${selectedEvent.status === "Paid" ? "text-green-600" : "text-orange-600"}`}>
                    {selectedEvent.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-700">Previous Payments</h4>
              {!selectedEvent.paymentHistory || selectedEvent.paymentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No payment history available</p>
                </div>
              ) : (
                selectedEvent.paymentHistory.map((payment, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          ₹{payment.amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Type: <span className="font-medium">{payment.paymentType}</span>
                          {payment.interestIncluded > 0 && (
                            <span> • Interest: ₹{payment.interestIncluded.toLocaleString('en-IN')}</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          payment.paymentType === "full" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {payment.paymentType === "full" ? "Full Payment" : "Partial"}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          Remaining: ₹{payment.remainingAfterPayment.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


const NavItem = ({ icon, label, active = false, onClick, closeSidebar }) => (
  <div
    onClick={() => {
      if (onClick) onClick();
      if (closeSidebar) closeSidebar();
    }}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-[#ff4d00] text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-700/40"
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
=======
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