import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

const API_URL = "http://localhost:5000/api/budgets";

function Budget() {

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

  const [form, setForm] = useState({
    category: "",
    budgetAmount: "",
    month: "",
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

      await axios.post(
        API_URL,
        {
          category: form.category,
          budgetAmount: Number(form.budgetAmount),
          month: form.month,
          description: form.description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Budget created successfully");

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

        <div className="p-8">
          <h1 className="text-3xl font-black italic text-white">
            Tax<span className="text-[#ff4d00]">Pal</span>
          </h1>
        </div>

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

export default Budget;