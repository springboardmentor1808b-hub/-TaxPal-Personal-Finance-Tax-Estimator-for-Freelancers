import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Calculator,
  CalendarDays,
  BarChart3,
  User,
  LogOut
} from "lucide-react";

const TaxCalendar = () => {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [events,setEvents] = useState([]);

  useEffect(()=>{

    const currentYear = new Date().getFullYear();

    const generatedEvents = [

      {
        title:"Q1 Estimated Tax Payment",
        date:`15 June ${currentYear}`,
        description:"First quarter advance tax payment due."
      },

      {
        title:"Q2 Estimated Tax Payment",
        date:`15 September ${currentYear}`,
        description:"Second quarter advance tax payment due."
      },

      {
        title:"Q3 Estimated Tax Payment",
        date:`15 December ${currentYear}`,
        description:"Third quarter advance tax payment due."
      },

      {
        title:"Q4 Estimated Tax Payment",
        date:`15 March ${currentYear+1}`,
        description:"Final advance tax payment due."
      }

    ];

    setEvents(generatedEvents);

  },[]);

  return (

    <div className="flex min-h-screen bg-[#fdfaf5]">

      {/* SIDEBAR */}
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

          <NavItem icon={<BarChart3 size={20}/>} label="Reports"
            onClick={()=>navigate("/reports")} />

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
            <LogOut size={14}/> Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-10">

        <h1 className="text-4xl font-black mb-6">
          Tax Calendar
        </h1>

        <div className="bg-white p-8 rounded-3xl shadow space-y-6">

          {events.map((event,index)=>(

            <div key={index} className="border p-4 rounded-xl">

              <h3 className="font-semibold">
                {event.title}
              </h3>

              <p className="text-gray-500 text-sm">
                {event.date}
              </p>

              <p className="text-gray-600 text-sm">
                {event.description}
              </p>

            </div>

          ))}

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
    <span className="text-sm">{label}</span>
  </div>

);

export default TaxCalendar;