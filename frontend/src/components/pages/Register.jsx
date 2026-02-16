import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', password: '', country: '', incomeBracket: ''
    });
    const [errors, setErrors] = useState({});

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        alert("Success! Welcome to TaxPal.");
    };

    return (
       <div className="min-h-screen flex justify-center bg-[#fafafa] font-sans p-4 pt-32 pb-10">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-[#eee] min-h-[580px]">
                
                {}
                <div className="md:w-[40%] bg-[#ff4d00] p-8 flex flex-col justify-center text-white relative">
                    <h1 className="text-4xl font-black mb-2 italic">TaxPal</h1>
                    <div className="h-1 w-12 bg-white mb-6 rounded-full"></div>
                    <h2 className="text-2xl font-bold mb-2">Join Us</h2>
                    <p className="text-[#ffe0d1] text-sm opacity-90 font-light italic">Simplify your taxes today.</p>
                </div>

                {}
                <div className="md:w-[60%] p-6 md:p-10 bg-white">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Create Account</h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-1">
                                <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className={`w-full p-3 text-sm border rounded-xl bg-[#fafafa] outline-none transition-all ${errors.fullName ? 'border-red-400' : 'border-[#eee] focus:border-[#ff4d00]'}`} />
                                {errors.fullName && <p className="text-red-500 text-[9px] mt-1 ml-1">{errors.fullName}</p>}
                            </div>
                            <div className="md:col-span-1">
                                <input type="number" name="phone" placeholder="Phone" onChange={handleChange} className={`w-full p-3 text-sm border rounded-xl bg-[#fafafa] outline-none transition-all ${errors.phone ? 'border-red-400' : 'border-[#eee] focus:border-[#ff4d00]'}`} />
                                {errors.phone && <p className="text-red-500 text-[9px] mt-1 ml-1">{errors.phone}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className={`w-full p-3 text-sm border rounded-xl bg-[#fafafa] outline-none transition-all ${errors.email ? 'border-red-400' : 'border-[#eee] focus:border-[#ff4d00]'}`} />
                                {errors.email && <p className="text-red-500 text-[9px] mt-1 ml-1">{errors.email}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <input type="password" name="password" placeholder="Password" onChange={handleChange} className={`w-full p-3 text-sm border rounded-xl bg-[#fafafa] outline-none transition-all ${errors.password ? 'border-red-400' : 'border-[#eee] focus:border-[#ff4d00]'}`} />
                                {errors.password && <p className="text-red-500 text-[9px] mt-1 ml-1">{errors.password}</p>}
                            </div>
                            
                            {}
                            <div className="md:col-span-1">
                                <select name="country" onChange={handleChange} className={`w-full p-3 text-sm border rounded-xl bg-[#fafafa] outline-none text-slate-500 ${errors.country ? 'border-red-400' : 'border-[#eee] focus:border-[#ff4d00]'}`}>
                                    <option value="">Country</option>
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">UK</option>
                                    <option value="Canada">Canada</option>
                                    <option value="UAE">UAE</option>
                                    <option value="Australia">Australia</option>
                                </select>
                                {errors.country && <p className="text-red-500 text-[9px] mt-1 ml-1">{errors.country}</p>}
                            </div>

                            {}
                            <div className="md:col-span-1">
                                <select name="incomeBracket" onChange={handleChange} className={`w-full p-3 text-sm border rounded-xl bg-[#fafafa] outline-none text-slate-500 ${errors.incomeBracket ? 'border-red-400' : 'border-[#eee] focus:border-[#ff4d00]'}`}>
                                    <option value="">Income</option>
                                    <option value="0-5L">Below ₹5 Lakh</option>
                                    <option value="5-10L">₹5L - ₹10 Lakh</option>
                                    <option value="10-20L">₹10L - ₹20 Lakh</option>
                                    <option value="20-50L">₹20L - ₹50 Lakh</option>
                                    <option value="50L+">Above ₹50 Lakh</option>
                                </select>
                                {errors.incomeBracket && <p className="text-red-500 text-[9px] mt-1 ml-1">{errors.incomeBracket}</p>}
                            </div>

                            <div className="md:col-span-2 mt-2">
                                <button type="submit" className="w-full bg-[#1a1a1a] text-white font-bold p-3 rounded-xl hover:bg-[#333] transition-all transform active:scale-95 text-sm">
                                    Register
                                </button>
                                <p className="text-center text-[#999] mt-4 text-[12px] font-medium">
                                    Already have an account? <span onClick={() => navigate('/login')} className="text-[#ff4d00] font-bold cursor-pointer hover:underline">Login here</span>
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