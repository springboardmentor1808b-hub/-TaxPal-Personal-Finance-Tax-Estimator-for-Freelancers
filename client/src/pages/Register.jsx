import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {

  const currencyMap = {
    india: "₹",
    usa: "$",
    uk: "£"
  };

  const formatNumber = (value) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    country: "",
    income: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, country, income } = formData;

    let newErrors = {};

    if (!fullName) newErrors.fullName = true;
    if (!email) newErrors.email = true;
    if (!password || password.length < 6) newErrors.password = true;
    if (!country) newErrors.country = true;
    if (!income) newErrors.income = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fix the highlighted fields");
      return;
    }

    const normalizedCountry = country.trim().toLowerCase();
    const selectedCurrency = currencyMap[normalizedCountry] || "₹";

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          country,
          income: Number(income.replace(/,/g, "")),
          currency: selectedCurrency
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Registration successful");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        country: "",
        income: ""
      });

      setErrors({});

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const normalizedCountry = formData.country.trim().toLowerCase();
  const dynamicCurrency = currencyMap[normalizedCountry] || "₹";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Your TaxPal Account
        </h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 outline-none ${
              errors.fullName ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 outline-none ${
              errors.email ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 outline-none ${
              errors.password ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Country */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Country *</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 outline-none ${
              errors.country ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Annual Income */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Annual Income *</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">
              {dynamicCurrency}
            </span>

            <input
              type="text"
              name="income"
              placeholder={`e.g. ${dynamicCurrency} 5,00,000`}
              value={formData.income}
              onChange={(e) => {
                const formatted = formatNumber(e.target.value);
                setFormData({
                  ...formData,
                  income: formatted
                });
                setErrors({ ...errors, income: "" });
              }}
              className={`w-full pl-7 mt-1 p-2 border rounded-lg focus:ring-2 outline-none ${
                errors.income ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-400"
              }`}
            />
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Register
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
