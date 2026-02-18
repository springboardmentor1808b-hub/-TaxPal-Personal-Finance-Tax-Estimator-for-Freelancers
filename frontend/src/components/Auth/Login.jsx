import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../../api";

const Login = () => {
    const navigate = useNavigate();

    // State for form data
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // State for field errors
    const [errors, setErrors] = useState({});
    // State for loading indicator
    const [loading, setLoading] = useState(false);

    // Function to validate a single field
    const validateField = (name, value) => {
        let errorMsg = '';

        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                // Validate email only if not empty
                if (value.length > 0 && !emailRegex.test(value)) errorMsg = 'Invalid Email';
                break;
            case 'password':
                // Password must be at least 6 characters if not empty
                if (value.length > 0 && value.length < 6) errorMsg = 'Min 6 chars';
                break;
            default:
                break;
        }

        return errorMsg;
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validate field on change and update errors
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields before submitting
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        // If there are validation errors, stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            // Call login API
            await API.post("/auth/login", formData);

            alert("Login successful!");
            navigate("/dashboard"); // Navigate to dashboard on success

        } catch (err) {
            // Show error from API response or generic error
            alert(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f5] to-[#eaeaea] p-6 font-sans">

            {/* Main container with shadow and rounded corners */}
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 min-h-[600px]">

                {/* Left Branding Section */}
                <div className="md:w-[40%] bg-[#ff4d00] p-10 flex flex-col justify-center text-white">
                    <h1 className="text-4xl font-black italic mb-2">TaxPal</h1>
                    <div className="h-1 w-14 bg-white mb-6 rounded-full"></div>
                    <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-[#ffe0d1] text-sm italic opacity-90">
                        Login to manage your income and expenses effortlessly.
                    </p>
                </div>

                {/* Right Login Form */}
                <div className="md:w-[60%] p-8 md:p-12 bg-white flex items-center">

                    <div className="w-full max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8">
                            Login to Account
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email Input */}
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    onChange={handleChange}
                                    className={`w-full p-3 text-sm border rounded-xl bg-gray-50 outline-none transition ${
                                        errors.email ? 'border-red-400' : 'border-gray-200 focus:border-[#ff4d00]'
                                    }`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Password Input */}
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    className={`w-full p-3 text-sm border rounded-xl bg-gray-50 outline-none transition ${
                                        errors.password ? 'border-red-400' : 'border-gray-200 focus:border-[#ff4d00]'
                                    }`}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full ${
                                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff4d00] hover:bg-[#e84300]'
                                } text-white font-semibold p-3 rounded-xl transition duration-200 active:scale-95`}
                            >
                                {loading ? "Signing In..." : "Login"}
                            </button>

                            {/* Link to Register */}
                            <p className="text-center text-gray-500 mt-4 text-sm">
                                Don’t have an account?{" "}
                                <span
                                    onClick={() => navigate('/register')}
                                    className="text-[#ff4d00] font-semibold cursor-pointer hover:underline"
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