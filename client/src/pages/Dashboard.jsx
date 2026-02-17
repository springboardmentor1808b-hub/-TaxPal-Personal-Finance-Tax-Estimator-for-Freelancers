import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedName = localStorage.getItem("userName");
    
    if (!token) {
      navigate("/login");
      return; 
    }
    
    setUser({
      name: savedName || "User",
      email: localStorage.getItem("userEmail") || "user@example.com",
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50/30">
      {/* Navbar - Responsive & Consistent */}
      <nav className="bg-white border-b border-emerald-100 p-4 shadow-sm flex justify-between items-center px-6 md:px-12">
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">
          Tax<span className="text-emerald-600">Pal</span>
        </h1>
        <div className="flex items-center gap-4">
           <span className="hidden md:block text-sm font-medium text-gray-500">{user?.email}</span>
           <button 
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-all active:scale-95"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl shadow-emerald-500/5 border border-emerald-100 max-w-2xl w-full relative overflow-hidden">
          
          {/* Decorative Background Element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full opacity-50"></div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
              👋
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Hello, <span className="text-emerald-600">{user?.name}</span>!
            </h2>
            
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              Welcome to your personal <span className="font-bold text-gray-800 tracking-wide uppercase text-sm">Tax Summary</span>. 
              Everything looks good today!
            </p>

            {/* Quick Stats Placeholder - Simple and Clean */}
{user && (
  <div className="grid grid-cols-2 gap-4 mt-6">
    <div className="bg-emerald-50 p-4 rounded-2xl text-left border border-emerald-100">
      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Account Status</p>
      <p className="text-gray-900 font-bold">Active</p>
    </div>
    <div className="bg-gray-50 p-4 rounded-2xl text-left border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Plan</p>
      <p className="text-gray-900 font-bold">Free Tier</p>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;