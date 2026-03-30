import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Live field validation
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) error = "Invalid email address";
        break;

      case "password":
        if (value && value.length < 6) error = "Minimum 6 characters";
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
      if (!formData[key]) newErrors[key] = "Required";
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      // Save auth
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccessMessage("Login successful!");

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f5] to-[#eaeaea] p-6">

      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">

        {/* Left */}
        <div className="md:w-[40%] bg-[#ff4d00] p-10 flex flex-col justify-center text-white">
          <h1 className="text-4xl font-black italic mb-2">TaxPal</h1>
          <div className="h-1 w-14 bg-white mb-6 rounded-full"></div>
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-[#ffe0d1] text-sm italic">
            Login to manage your income and expenses effortlessly.
          </p>
        </div>

        {/* Right */}
        <div className="md:w-[60%] p-10 flex items-center">
          <div className="w-full max-w-lg mx-auto">

            <h2 className="text-2xl font-bold mb-6">Login to Account</h2>

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <input
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  className={`w-full p-3 rounded-xl bg-gray-50 border outline-none ${errors.email
                      ? "border-red-400"
                      : "border-gray-200 focus:border-[#ff4d00]"
                    }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className={`w-full p-3 rounded-xl bg-gray-50 border outline-none ${errors.password
                      ? "border-red-400"
                      : "border-gray-200 focus:border-[#ff4d00]"
                    }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <button
                disabled={loading}
                className={`w-full p-3 rounded-xl text-white font-semibold transition ${loading
                    ? "bg-gray-400"
                    : "bg-[#ff4d00] hover:bg-[#e84300]"
                  }`}
              >
                {loading ? "Signing In..." : "Login"}
              </button>

              <p className="text-center text-gray-500 text-sm">
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-[#ff4d00] font-semibold cursor-pointer"
                >
                  Register here
                </span>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
