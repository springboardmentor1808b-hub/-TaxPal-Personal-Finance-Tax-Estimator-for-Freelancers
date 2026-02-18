import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../../api";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', password: '', country: '', incomeBracket: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        let errorMsg = '';
        switch (name) {
            case 'fullName': if (value.length > 0 && value.length < 3) errorMsg = 'Short Name'; break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value.length > 0 && !emailRegex.test(value)) errorMsg = 'Invalid Email'; break;
            case 'phone': if (value.length > 0 && value.length !== 10) errorMsg = 'Need 10 digits'; break;
            case 'password': if (value.length > 0 && value.length < 6) errorMsg = 'Min 6 chars'; break;
            case 'country': if (value === '') errorMsg = 'Required'; break;
            case 'incomeBracket': if (value === '') errorMsg = 'Required'; break;
            default: break;
        }
        return errorMsg;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        const nameParts = formData.fullName.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        try {
            const payload = {
                firstName,
                lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                country: formData.country,
                incomeBracket: formData.incomeBracket,
            };

            await API.post("/auth/register", payload);

            alert("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1500);

        } catch (err) {
            alert(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f5] to-[#eaeaea] p-6 font-sans">

            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 min-h-[600px]">

                {/* Left Branding */}
                <div className="md:w-[40%] bg-[#ff4d00] p-10 flex flex-col justify-center text-white">
                    <h1 className="text-4xl font-black italic mb-2">TaxPal</h1>
                    <div className="h-1 w-14 bg-white mb-6 rounded-full"></div>
                    <h2 className="text-2xl font-bold mb-2">Join Us</h2>
                    <p className="text-[#ffe0d1] text-sm italic opacity-90">
                        Simplify your taxes today and take control of your finances.
                    </p>
                </div>

                {/* Right Form */}
                <div className="md:w-[60%] p-8 md:p-12 bg-white flex items-center">

                    <div className="w-full max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8">
                            Create Account
                        </h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    className={`w-full p-3 text-sm border rounded-xl bg-gray-50 outline-none transition ${
                                        errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-[#ff4d00]'
                                    }`}
                                />
                                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                            </div>

                            <div>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone"
                                    maxLength="10"
                                    onChange={handleChange}
                                    className={`w-full p-3 text-sm border rounded-xl bg-gray-50 outline-none transition ${
                                        errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-[#ff4d00]'
                                    }`}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            <div className="md:col-span-2">
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

                            <div className="md:col-span-2">
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

                            <div>
                                <select
                                    name="country"
                                    onChange={handleChange}
                                    className={`w-full p-3 text-sm border rounded-xl bg-gray-50 outline-none transition ${
                                        errors.country ? 'border-red-400' : 'border-gray-200 focus:border-[#ff4d00]'
                                    }`}
                                >
                                    <option value="">Country</option>
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">UK</option>
                                </select>
                                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                            </div>

                            <div>
                                <select
                                    name="incomeBracket"
                                    onChange={handleChange}
                                    className={`w-full p-3 text-sm border rounded-xl bg-gray-50 outline-none transition ${
                                        errors.incomeBracket ? 'border-red-400' : 'border-gray-200 focus:border-[#ff4d00]'
                                    }`}
                                >
                                    <option value="">Income</option>
                                    <option value="0-5L">Below ₹5 Lakh</option>
                                    <option value="5-10L">₹5L - ₹10 Lakh</option>
                                    <option value="10-20L">₹10L - ₹20 Lakh</option>
                                    <option value="20-50L">₹20L - ₹50 Lakh</option>
                                    <option value="50L+">Above ₹50 Lakh</option>
                                </select>
                                {errors.incomeBracket && <p className="text-red-500 text-xs mt-1">{errors.incomeBracket}</p>}
                            </div>

                            <div className="md:col-span-2 mt-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full ${
                                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff4d00] hover:bg-[#e84300]'
                                    } text-white font-semibold p-3 rounded-xl transition duration-200 active:scale-95`}
                                >
                                    {loading ? "Creating Account..." : "Register"}
                                </button>

                                <p className="text-center text-gray-500 mt-5 text-sm">
                                    Already have an account?{" "}
                                    <span
                                        onClick={() => navigate('/login')}
                                        className="text-[#ff4d00] font-semibold cursor-pointer hover:underline"
                                    >
                                        Login here
                                    </span>
                                </p>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;