import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/budgets";

function Budget() {
  const [budgets, setBudgets] = useState([]);

  const [form, setForm] = useState({
    category: "",
    budgetAmount: "",
    month: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
          month: form.month, // format: YYYY-MM
          description: form.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Budget created successfully");

      setForm({
        category: "",
        budgetAmount: "",
        month: "",
        description: "",
      });

      fetchBudgets();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating budget");
    }
  };

  // ================= GET BUDGETS =================
  const fetchBudgets = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBudgets(res.data.budgets);
    } catch (error) {
      console.log("Error fetching budgets");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h2 className="text-2xl font-bold text-orange-500 mb-4">
          Budget Settings
        </h2>

        {/* Create Budget Card */}
        <div className="bg-white border border-orange-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-orange-500 mb-4">
            Create New Budget
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            {/* Category */}
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border border-orange-200 p-2 rounded"
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
            </select>

            {/* Amount */}
            <input
              type="number"
              name="budgetAmount"
              placeholder="Budget Amount"
              value={form.budgetAmount}
              onChange={handleChange}
              className="border border-orange-200 p-2 rounded"
            />

            {/* Month (IMPORTANT) */}
            <input
              type="month"
              name="month"
              value={form.month}
              onChange={handleChange}
              className="border border-orange-200 p-2 rounded"
            />

            {/* Description */}
            <input
              type="text"
              name="description"
              placeholder="Description (optional)"
              value={form.description}
              onChange={handleChange}
              className="border border-orange-200 p-2 rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() =>
                setForm({
                  category: "",
                  budgetAmount: "",
                  month: "",
                  description: "",
                })
              }
              className="px-4 py-2 border border-orange-300 rounded text-orange-500"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Create Budget
            </button>
          </div>
        </div>

        {/* Budget List */}
        <div className="bg-white border border-orange-200 rounded-lg p-6 mt-6 shadow-sm">
          <h3 className="text-lg font-semibold text-orange-500 mb-4">
            Budget List
          </h3>

          {budgets.length === 0 ? (
            <p className="text-gray-500 text-center">
              No budgets created yet
            </p>
          ) : (
            <table className="w-full border">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="p-2">Category</th>
                  <th className="p-2">Month</th>
                  <th className="p-2">Budget</th>
                  <th className="p-2">Spent</th>
                  <th className="p-2">Remaining</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((b) => (
                  <tr key={b._id} className="text-center border-t">
                    <td className="p-2">{b.category}</td>
                    <td className="p-2">{b.month}</td>
                    <td className="p-2">₹{b.budget}</td>
                    <td className="p-2">₹{b.spent}</td>
                    <td className="p-2">₹{b.remaining}</td>
                    <td
                      className={`p-2 font-semibold ${
                        b.status === "Exceeded"
                          ? "text-red-600"
                          : b.status === "Warning"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {b.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Budget;