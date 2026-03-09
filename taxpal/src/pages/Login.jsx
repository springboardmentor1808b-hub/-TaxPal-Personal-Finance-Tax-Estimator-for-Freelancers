import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logo } from '../assets/assets';
import { useTransactions } from '../context/TransactionContext';
import { useCategories } from '../context/CategoryContext';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const { refreshTransactions } = useTransactions();
  const { refreshCategories } = useCategories();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // Save token + full user object (must include country from backend)
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          // refresh any data contexts so they fetch now that token exists
          refreshTransactions();
          refreshCategories();
          // ── Redirect to dashboard, not home ──
          navigate('/dashboard');
        } else {
          alert("Login Failed: " + data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Could not connect to server.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="hidden lg:flex flex-col justify-center text-white p-12">
          <div className="mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-3xl inline-block mb-6">
              <img src={logo} alt="TaxPal Logo" className="w-16 h-16 drop-shadow-2xl" />
            </div>
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome Back!</h1>
            <p className="text-xl text-white/90 mb-8">Sign in to continue managing your finances with ease</p>
          </div>
          <div className="space-y-4">
            {["Track income & expenses", "Quarterly tax estimates", "Financial reports"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 lg:p-12">
          <div className="lg:hidden text-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl inline-block mb-4">
              <img src={logo} alt="TaxPal Logo" className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          </div>
          
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white transition-all ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-500 focus:border-purple-500'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><span>⚠</span>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white transition-all ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-500 focus:border-purple-500'}`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><span>⚠</span>{errors.password}</p>}
            </div>

            <button type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
              Sign In
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-purple-600 font-semibold hover:text-purple-700 hover:underline">
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}