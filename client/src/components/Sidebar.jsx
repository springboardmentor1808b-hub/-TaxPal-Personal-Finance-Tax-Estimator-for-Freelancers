import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png"; 
import ProPlanCard from "./ProPlanCard";

const Sidebar = ({ isOpen, setIsOpen, userStatus }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Transactions", icon: "💸", path: "/transactions" },
    { name: "Tax Calendar", icon: "📅", path: "/calendar" },
    { name: "Documents", icon: "📁", path: "/documents" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Overlay with smooth fade */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 animate-fadeIn" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-[70] h-screen w-[280px] bg-white border-r border-gray-100 
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
        flex flex-col shadow-2xl lg:shadow-none
      `}>
        
        {/* Logo & Close Button */}
        <div className="p-8 pb-10 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform duration-300">
               <img src={logo} alt="TaxPal" className="h-6 w-auto brightness-0 invert" />
            </div>
            <span className="font-black text-2xl text-gray-900 tracking-tighter">
              Tax<span className="text-emerald-600">Pal</span>
            </span>
          </Link>

          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-rose-500 transition-colors"
          >
            <span className="text-xl font-bold">✕</span>
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link 
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  relative group flex items-center gap-4 px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 no-underline
                  ${isActive 
                    ? 'bg-emerald-50/60 text-emerald-700 shadow-sm shadow-emerald-100/50' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {/* Active Indicator Strip */}
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                )}

                <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                
                {item.name}

                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Dynamic Pro Card Section */}
        <div className="p-6 mt-auto border-t border-gray-50 bg-gray-50/30">
          <ProPlanCard userStatus={userStatus} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;