import React, { useState } from 'react';
import API from "../../api";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {
    email: "",
    password: "",
  };

  if (!formData.email) newErrors.email = "Email is required";
  if (!formData.password) newErrors.password = "Password is required";

  setErrors(newErrors);

  if (newErrors.email || newErrors.password) return;

  try {
    const res = await API.post("/auth/login", formData);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setSuccessMessage("Login successful!");

    setTimeout(() => {
      navigate("/");
    }, 1000);

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Panel - Orange Section */}
        <div className="bg-orange-600 p-8 flex flex-col justify-center text-white space-y-4">
          <div>
            <h1 className="text-3xl font-bold">TaxPal</h1>
            <div className="w-10 h-0.5 bg-white mt-1"></div>
          </div>
          <h2 className="text-xl font-semibold">Welcome Back</h2>
          <p className="text-sm opacity-90 leading-relaxed">
            Login to continue your tax-saving journey.
            Fast, secure, and built for you.
          </p>
        </div>

        {/* Right Panel - Login Form */}
        <div className="p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Login Account</h2>
            <p className="text-gray-400 text-xs mt-1">Please enter your credentials to login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 rounded-lg outline-none focus:ring-2 ${
                  errors.email ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-orange-400'
                } text-gray-700 placeholder-gray-400 text-sm`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 rounded-lg outline-none focus:ring-2 ${
                  errors.password ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-orange-400'
                } text-gray-700 placeholder-gray-400 text-sm`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition text-sm mt-4"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-400 mt-4 text-xs">
            Don't have an account?{' '}
            <a href="/register" className="text-orange-500 font-medium cursor-pointer hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
