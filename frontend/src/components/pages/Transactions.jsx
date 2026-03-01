import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { 
  TrendingUp, TrendingDown, Trash2, LayoutDashboard, 
  ArrowLeftRight, Wallet, Calculator, BarChart3, User, LogOut 
} from "lucide-react";
import API from "../../api"; 

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "income",
    amount: "",
    category: "Work",
    description: "",
    date: "",
  });
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data.transactions || res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = async () => {
    try {
      const res = await API.post("/transactions", formData);
      setTransactions([res.data.transaction || res.data, ...transactions]);
      setFormData({ type: "income", amount: "", category: "Work", description: "", date: "" });
    } catch (err) {
      alert("Error adding transaction");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      try {
        await API.delete(`/transactions/${id}`);
        setTransactions(transactions.filter((tx) => tx._id !== id));
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
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
          <NavItem icon={<ArrowLeftRight size={20} />} label="Transactions" active onClick={() => navigate("/transactions")} />
          <NavItem icon={<Wallet size={20} />} label="Budgets" onClick={() => navigate("/budgets")} />
          <NavItem icon={<Calculator size={20} />} label="Tax Estimator"onClick={() => navigate("/tax-estimator")}/>
          <NavItem icon={<CalendarDays size={20}/>}label="Tax Calendar"onClick={() => navigate("/tax-calendar")}/>
          <NavItem icon={<BarChart3 size={20} />} label="Reports" />
          
          {/* ✅ Profile NavItem Added Here */}
          <NavItem 
            icon={<User size={20} />} 
            label="Profile" 
            onClick={() => navigate("/profile")} 
          />
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
          <h2 className="text-4xl font-black text-[#1a1a1a]">Transactions</h2>
          <p className="text-gray-500">Manage your financial history here.</p>
        </header>

        <div className="flex gap-4 mb-10">
          <button onClick={() => navigate("/income")} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-600">
            <TrendingUp size={20}/> + Add Income
          </button>
          <button onClick={() => navigate("/expense")} className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-rose-100 transition-all hover:bg-rose-600">
            <TrendingDown size={20}/> + Add Expense
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm mb-10 border border-gray-100">
          <h3 className="font-bold mb-6 text-[#1a1a1a]">Quick Entry</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select name="type" value={formData.type} onChange={handleChange} className="bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d00]">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d00]" />
            <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d00]" />
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d00]" />
            <button onClick={handleAddTransaction} className="bg-[#1a1a1a] text-white px-4 py-3 rounded-xl font-bold hover:bg-black transition-colors">
              Save Record
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-6 text-[#1a1a1a]">Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm uppercase tracking-wider border-b border-gray-50">
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className={`py-4 font-bold capitalize ${tx.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                      {tx.type}
                    </td>
                    <td className="py-4 font-medium">{tx.category}</td>
                    <td className="py-4 font-black text-[#1a1a1a]">₹{tx.amount.toLocaleString()}</td>
                    <td className="py-4 text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="py-4 text-right">
                      <button onClick={() => handleDelete(tx._id)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    <span className="text-sm">{label}</span>
  </div>
);
export default Transactions;