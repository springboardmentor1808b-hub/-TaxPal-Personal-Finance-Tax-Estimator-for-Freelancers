import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { CalendarDays } from "lucide-react";
import axios from "axios";
import { 
  LayoutDashboard, ArrowLeftRight, Wallet, 
  Calculator, BarChart3, User, LogOut, PlusCircle, Trash2 
=======
import axios from "axios";

import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Calculator,
  BarChart3,
  CalendarDays,
  User,
  LogOut,
  PlusCircle,
  Trash2
>>>>>>> c227d919a9a7a12e0716f4189022303f094cb7d8
} from "lucide-react";

const API_URL = "http://localhost:5000/api/budgets";

function Budget() {
<<<<<<< HEAD
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
=======

  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [budgets, setBudgets] = useState([]);

  const [categories, setCategories] = useState([
    "Transport",
    "Shopping",
    "Food",
    "Bills",
    "Entertainment"
  ]);

>>>>>>> c227d919a9a7a12e0716f4189022303f094cb7d8
  const [form, setForm] = useState({
    category: "",
    budgetAmount: "",
    month: "",
<<<<<<< HEAD
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
=======
    description: ""
  });

  const token = localStorage.getItem("token");

  /* =============================
        CATEGORY ADD LOGIC
  ============================= */

  const handleCategoryChange = (e) => {

    if (e.target.value === "add_new") {

      const newCategory = prompt("Enter new category");

      if (newCategory) {

        const trimmed = newCategory.trim();

        const exists = categories.some(
          (cat) => cat.toLowerCase() === trimmed.toLowerCase()
        );

        if (!exists) {

          const updated = [...categories, trimmed];

          setCategories(updated);

          setForm({ ...form, category: trimmed });

        } else {

          alert("Category already exists");

          setForm({ ...form, category: trimmed });

        }

      }

    } else {

      setForm({ ...form, category: e.target.value });

    }

  };

  const handleChange = (e) => {

    setForm({ ...form, [e.target.name]: e.target.value });

  };

  /* =============================
        FETCH BUDGETS
  ============================= */

  const fetchBudgets = async () => {

    try {

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBudgets(res.data.budgets || []);

    } catch (error) {

      console.log("Error fetching budgets", error);

    }

  };

  useEffect(() => {

    fetchBudgets();

  }, []);

  /* =============================
        CREATE BUDGET
  ============================= */

  const handleSubmit = async () => {

    if (!form.category || !form.budgetAmount || !form.month) {

      alert("Please fill all required fields");
      return;

    }

    try {

>>>>>>> c227d919a9a7a12e0716f4189022303f094cb7d8
      await axios.post(
        API_URL,
        {
          category: form.category,
          budgetAmount: Number(form.budgetAmount),
          month: form.month,
<<<<<<< HEAD
          description: form.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
=======
          description: form.description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
>>>>>>> c227d919a9a7a12e0716f4189022303f094cb7d8
        }
      );

      alert("Budget created successfully");
<<<<<<< HEAD
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
=======

      setForm({
        category: "",
        budgetAmount: "",
        month: "",
        description: ""
      });

      fetchBudgets();

    } catch (error) {

      alert(error.response?.data?.message || "Error creating budget");

    }

  };

  /* =============================
        DELETE BUDGET
  ============================= */

  const handleDelete = async (id) => {

    if (window.confirm("Delete this budget?")) {

      try {

        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        fetchBudgets();

      } catch (error) {

        alert("Error deleting budget");

      }

    }

  };

  return (

    <div className="flex min-h-screen bg-[#FDFCFB] font-sans text-gray-900">

      {/* SIDEBAR */}

      <aside className="w-64 bg-[#1a1a1a] flex flex-col fixed h-full shadow-2xl">

>>>>>>> c227d919a9a7a12e0716f4189022303f094cb7d8
        <div className="p-8">
          <h1 className="text-3xl font-black italic text-white">
            Tax<span className="text-[#ff4d00]">Pal</span>
          </h1>
        </div>
<<<<<<< HEAD
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
=======

        <nav className="flex-1 px-3 mt-2 space-y-1">

          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={()=>navigate("/dashboard")}/>
          <NavItem icon={<ArrowLeftRight size={20}/>} label="Transactions" onClick={()=>navigate("/transactions")}/>
          <NavItem icon={<Wallet size={20}/>} label="Budgets" active/>
          <NavItem icon={<Calculator size={20}/>} label="Tax Estimator" onClick={()=>navigate("/tax-estimator")}/>
          <NavItem icon={<CalendarDays size={20}/>} label="Tax Calendar" onClick={()=>navigate("/tax-calendar")}/>
          <NavItem icon={<BarChart3 size={20}/>} label="Reports" onClick={()=>navigate("/reports")}/>
          <NavItem icon={<User size={20}/>} label="Profile" onClick={()=>navigate("/profile")}/>

        </nav>

        {/* USER */}

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
            onClick={()=>{
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#ff4d00]"
          >
            <LogOut size={14}/> Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="flex-1 ml-64 p-10">

        <header className="mb-10">

          <h2 className="text-4xl font-black text-[#1a1a1a]">
            Budgets
          </h2>

          <p className="text-gray-500">
            Plan your monthly spending limits.
          </p>

        </header>

        {/* CREATE BUDGET */}

        <div className="bg-white p-8 rounded-3xl shadow-sm mb-10 border">

          <div className="flex items-center gap-2 mb-6">
            <PlusCircle className="text-[#ff4d00]" size={24}/>
            <h3 className="text-xl font-bold">
              Create New Budget
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-4">

            <select
              name="category"
              value={form.category}
              onChange={handleCategoryChange}
              className="bg-gray-50 rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d00] outline-none"
            >

              <option value="">Select Category</option>

              {categories.map((cat,index)=>(
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}

              <option value="add_new">
                + Add New Category
              </option>

            </select>

            <input
              type="number"
              name="budgetAmount"
              placeholder="Budget Amount"
              value={form.budgetAmount}
              onChange={handleChange}
              className="bg-gray-50 rounded-xl p-3"
            />

            <input
              type="month"
              name="month"
              value={form.month}
              onChange={handleChange}
              className="bg-gray-50 rounded-xl p-3"
            />

            <button
              onClick={handleSubmit}
              className="bg-black text-white rounded-xl font-bold hover:bg-gray-900"
            >
              Set Budget
            </button>

          </div>

        </div>

        {/* BUDGET TABLE */}

        <div className="bg-white p-8 rounded-3xl shadow-sm border">

          <h3 className="font-bold mb-6">
            Budget Overview
          </h3>

          <table className="w-full text-left">

            <thead>

              <tr className="text-gray-400 border-b">
                <th>Category</th>
                <th>Month</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {[...budgets]
                .sort((a,b)=>b.month.localeCompare(a.month))
                .map((b)=>(
                  <tr key={b._id}>

                    <td>{b.category}</td>

                    <td>{b.month}</td>

                    <td>₹{b.budget.toLocaleString()}</td>

                    <td>₹{b.spent.toLocaleString()}</td>

                    <td>₹{b.remaining.toLocaleString()}</td>

                    <td>{b.status}</td>

                    <td>
                      <button onClick={()=>handleDelete(b._id)}>
                        <Trash2 size={18}/>
                      </button>
                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

      </main>

    </div>

  );

}

/* SIDEBAR ITEM */

const NavItem = ({icon,label,active=false,onClick}) => (

>>>>>>> c227d919a9a7a12e0716f4189022303f094cb7d8
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active
<<<<<<< HEAD
        ? "bg-[#ff4d00] text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-700/40"
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
=======
      ? "bg-[#ff4d00] text-white"
      : "text-gray-400 hover:text-white hover:bg-gray-700/40"
    }`}
  >

    {icon}

    <span className="text-sm">
      {label}
    </span>

  </div>

>>>>>>> c227d919a9a7a12e0716f4189022303f094cb7d8
);

export default Budget;