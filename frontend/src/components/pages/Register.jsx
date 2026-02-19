import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const Register = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard");
        }
    }, []);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        country: "",
        incomeBracket: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Live field validation
    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "fullName":
                if (value && value.length < 3) error = "Short name";
                break;

            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) error = "Invalid email";
                break;

            case "phone":
                if (value && value.length !== 10) error = "Need 10 digits";
                break;

            case "password":
                if (value && value.length < 6) error = "Min 6 characters";
                break;

            case "country":
                if (!value) error = "Required";
                break;

            case "incomeBracket":
                if (!value) error = "Required";
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        // Safe name split
        const parts = formData.fullName.trim().split(" ");
        const firstName = parts[0];
        const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";

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

            const res = await API.post("/auth/register", payload);

            // Save token
            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
            }

            alert("Registration successful!");

            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
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
                    <h2 className="text-2xl font-bold mb-2">Join Us</h2>
                    <p className="text-[#ffe0d1] text-sm italic">
                        Simplify your taxes today.
                    </p>
                </div>

                {/* Right */}
                <div className="md:w-[60%] p-10 flex items-center">
                    <div className="w-full max-w-lg mx-auto">

                        <h2 className="text-2xl font-bold mb-6">Create Account</h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <input name="fullName" placeholder="Full Name" onChange={handleChange}
                                    className={`w-full p-3 rounded-xl bg-gray-50 border outline-none ${errors.fullName ? "border-red-400" : "border-gray-200 focus:border-[#ff4d00]"
                                        }`} />
                                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                            </div>

                            <div>
                                <input name="phone" maxLength="10" placeholder="Phone" onChange={handleChange}
                                    className={`w-full p-3 rounded-xl bg-gray-50 border outline-none ${errors.phone ? "border-red-400" : "border-gray-200 focus:border-[#ff4d00]"
                                        }`} />
                                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <input name="email" placeholder="Email" onChange={handleChange}
                                    className={`w-full p-3 rounded-xl bg-gray-50 border outline-none ${errors.email ? "border-red-400" : "border-gray-200 focus:border-[#ff4d00]"
                                        }`} />
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <input type="password" name="password" placeholder="Password" onChange={handleChange}
                                    className={`w-full p-3 rounded-xl bg-gray-50 border outline-none ${errors.password ? "border-red-400" : "border-gray-200 focus:border-[#ff4d00]"
                                        }`} />
                                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                            </div>

                            <div>
                                <select name="country" onChange={handleChange}
                                    className={`w-full p-3 rounded-xl bg-gray-50 border outline-none ${errors.country ? "border-red-400" : "border-gray-200 focus:border-[#ff4d00]"
                                        }`}>
                                    <option value="">Country</option>
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">UK</option>
                                </select>
                            </div>

                            <div>
                                <select name="incomeBracket" onChange={handleChange}
                                    className={`w-full p-3 rounded-xl bg-gray-50 border outline-none ${errors.incomeBracket ? "border-red-400" : "border-gray-200 focus:border-[#ff4d00]"
                                        }`}>
                                    <option value="">Income</option>
                                    <option value="0-5L">Below ₹5 Lakh</option>
                                    <option value="5-10L">₹5L - ₹10 Lakh</option>
                                    <option value="10-20L">₹10L - ₹20 Lakh</option>
                                    <option value="20-50L">₹20L - ₹50 Lakh</option>
                                    <option value="50L+">Above ₹50 Lakh</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 mt-3">
                                <button disabled={loading}
                                    className={`w-full p-3 rounded-xl text-white font-semibold ${loading ? "bg-gray-400" : "bg-[#ff4d00] hover:bg-[#e84300]"
                                        }`}>
                                    {loading ? "Creating Account..." : "Register"}
                                </button>

                                <p className="text-center text-gray-500 mt-4 text-sm">
                                    Already have an account?{" "}
                                    <span onClick={() => navigate("/login")}
                                        className="text-[#ff4d00] font-semibold cursor-pointer">
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
