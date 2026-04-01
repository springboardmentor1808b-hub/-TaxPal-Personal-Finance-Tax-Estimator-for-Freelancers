import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupUser } from "../services/authService";

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    incomeBracket: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const data = await signupUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Account created successfully");

      navigate("/dashboard", { replace: true });

    } catch (error) {

      alert(error.response?.data?.message || "Signup failed");

    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8ff] flex flex-col justify-center items-center py-16 px-6 font-sans">

      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 mb-10 group">
        <div className="w-10 h-10 bg-[#6d28d9] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">TP</div>
        <span className="text-2xl font-black text-[#1e1b4b] tracking-tighter italic">TaxPal</span>
      </Link>

      <div className="w-full max-w-[520px] bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-purple-900/5 border border-purple-50">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-[#1e1b4b] mb-4 italic tracking-tighter">Join the Elite</h2>
          <p className="text-slate-500 font-medium text-sm">
            Setup your financial command center in seconds
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-black text-[#1e1b4b] uppercase tracking-[0.2em] mb-3 ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your name"
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-3xl bg-purple-50/30 border-2 border-transparent focus:border-purple-100 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-black text-[#1e1b4b] uppercase tracking-[0.2em] mb-3 ml-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-3xl bg-purple-50/30 border-2 border-transparent focus:border-purple-100 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold text-sm"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Password */}
            <div>
              <label className="block text-[11px] font-black text-[#1e1b4b] uppercase tracking-[0.2em] mb-3 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-3xl bg-purple-50/30 border-2 border-transparent focus:border-purple-100 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-black text-[#1e1b4b] uppercase tracking-[0.2em] mb-3 ml-1">
                Confirm
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-3xl bg-purple-50/30 border-2 border-transparent focus:border-purple-100 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold text-sm"
              />
            </div>

          </div>

          {/* Country */}
          <div>
            <label className="block text-[11px] font-black text-[#1e1b4b] uppercase tracking-[0.2em] mb-3 ml-1">
              Country
            </label>
            <select
              name="country"
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-3xl bg-purple-50/30 border-2 border-transparent focus:border-purple-100 focus:bg-white outline-none transition-all font-bold text-sm"
            >
              <option value="">Select your country</option>
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>

          {/* Income Bracket */}
          <div>
            <label className="block text-[11px] font-black text-[#1e1b4b] uppercase tracking-[0.15em] mb-2 ml-1">
              Income Bracket (Optional)
            </label>
            <select
              name="incomeBracket"
              onChange={handleChange}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-[#9333ea] focus:ring-4 focus:ring-purple-50 outline-none transition-all font-medium text-sm bg-white"
            >
              <option value="">Select your income bracket</option>
              <option>$0-$25k</option>
              <option>$25k-$50k</option>
              <option>$50k-$100k</option>
            </select>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-[#6d28d9] text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-purple-200 hover:bg-[#5b21b6] hover:-translate-y-1 transition-all mt-6 uppercase tracking-widest text-[13px]"
          >
            Create Account
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-sm font-bold text-slate-500 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6d28d9] font-black hover:underline uppercase tracking-widest text-[12px] ml-1">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}