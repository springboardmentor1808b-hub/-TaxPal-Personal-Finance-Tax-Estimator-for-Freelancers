import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-primary text-white py-4 md:py-5">
      <div className="max-w-7xl mx-auto px-6 flex items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-cream w-6 h-6 md:w-7 md:h-7 rounded-lg"></div>
          <span className="font-semibold text-base md:text-lg tracking-wide">
            TaxPal
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 md:gap-4 items-center ml-auto">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="bg-primary-300 hover:bg-yellow-500 transition text-white px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm font-medium shadow-md"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-primary-300 hover:bg-yellow-500 transition px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm font-medium shadow-md"
              >
                Signup →
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-primary-300 hover:bg-yellow-500 transition text-white px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm font-medium"
            >
              Logout
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
