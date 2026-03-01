import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import axios from "axios";
import { 
  LayoutDashboard, ArrowLeftRight, Wallet, 
  Calculator, BarChart3, User, LogOut, PlusCircle, Trash2 
} from "lucide-react";

const API_URL = "http://localhost:5000/api/budgets";

function Budget() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({
    category: "",
    budgetAmount: "",
    month: "",
    description: "",
  });

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= GET BUDGETS =================
  const fetchBudgets = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBudgets(res.data.budgets || []);
    } catch (error) {
      console.log("Error fetching budgets");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // ================= CREATE BUDGET =================
  const handleSubmit = async () => {
    if (!form.category || !form.budgetAmount || !form.month) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post(
        API_URL,
        {
          category: form.category,
          budgetAmount: Number(form.budgetAmount),
          month: form.month,
          description: form.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Budget created successfully");
      setForm({ category: "", budgetAmount: "", month: "", description: "" });
      fetchBudgets();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating budget");
    }
  };

  // ================= DELETE BUDGET (NEW) =================
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Budget deleted successfully");
        fetchBudgets(); // Refresh the list
      } catch (error) {
        alert(error.response?.data?.message || "Error deleting budget");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdfaf5] font-sans text-slate-700">
      
      {/* SIDEBAR - Black & Orange Theme */}
      <aside className="w-64 bg-[#1a1a1a] flex flex-col fixed h-full shadow-2xl">
        <div className="p-8">
          <h1 className="text-3xl font-black italic text-white">
            Tax<span className="text-[#ff4d00]">Pal</span>
          </h1>
        </div>
        <nav className="flex-1 px-3 mt-2 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => navigate("/dashboard")} />
          <NavItem icon={<ArrowLeftRight size={20} />} label="Transactions" onClick={() => navigate("/transactions")} />
          <NavItem icon={<Wallet size={20} />} label="Budgets" active onClick={() => navigate("/budgets")} />
          <NavItem icon={<Calculator size={20} />} label="Tax Estimator" onClick={() => navigate("/tax-estimator")}/>
          <NavItem icon={<CalendarDays size={20}/>} label="Tax Calendar"onClick={() => navigate("/tax-calendar")}/>
          <NavItem icon={<BarChart3 size={20} />} label="Reports" />
          <NavItem icon={<User size={20} />} label="Profile" onClick={() => navigate("/profile")} />
        </nav>

       <div className="p-3 border-t border-white/10">
      <div className="flex items-center gap-2 mb-3 text-white">
        <div className="w-8 h-8 bg-[#ff4d00] rounded-full flex items-center justify-center text-sm font-semibold">
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

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10">
          <h2 className="text-4xl font-black text-[#1a1a1a]">Budgets</h2>
          <p className="text-gray-500">Plan your monthly spending limits.</p>
        </header>

        {/* Create Budget Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm mb-10 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <PlusCircle className="text-[#ff4d00]" size={24} />
            <h3 className="text-xl font-bold text-[#1a1a1a]">Create New Budget</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              className="bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d00] outline-none"
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
            </select>

            <input 
              type="number" 
              name="budgetAmount" 
              placeholder="Budget Amount (₹)" 
              value={form.budgetAmount} 
              onChange={handleChange} 
              className="bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d00] outline-none" 
            />

            <input 
              type="month" 
              name="month" 
              value={form.month} 
              onChange={handleChange} 
              className="bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d00] outline-none" 
            />

            <button 
              onClick={handleSubmit} 
              className="bg-[#1a1a1a] text-white px-4 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
            >
              Set Budget
            </button>
          </div>
        </div>

        {/* Budget List Table Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-6 text-[#1a1a1a]">Budget Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm uppercase tracking-wider border-b border-gray-50">
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Month</th>
                  <th className="pb-4">Budget</th>
                  <th className="pb-4">Spent</th>
                  <th className="pb-4">Remaining</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {budgets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-400">No budgets created yet.</td>
                  </tr>
                ) : (
                  budgets.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold text-slate-700">{b.category}</td>
                      <td className="py-4 text-gray-500">{b.month}</td>
                      <td className="py-4 font-black text-[#1a1a1a]">₹{b.budget.toLocaleString()}</td>
                      <td className="py-4 text-rose-500 font-bold">₹{b.spent.toLocaleString()}</td>
                      <td className="py-4 text-emerald-500 font-bold">₹{b.remaining.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                          b.status === "Exceeded" ? "bg-rose-100 text-rose-600" :
                          b.status === "Warning" ? "bg-yellow-100 text-yellow-600" :
                          "bg-emerald-100 text-emerald-600"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      {/* Action column with delete button */}
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleDelete(b._id)}
                          className="text-gray-400 hover:text-rose-500 p-2 rounded-lg transition-colors"
                          title="Delete Budget"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

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

export default Budget;