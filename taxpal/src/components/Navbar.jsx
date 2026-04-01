import { Link, useNavigate } from 'react-router-dom';
import { logo } from '../assets/assets';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <nav className="flex justify-between items-center px-8 lg:px-16 xl:px-24 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <Link to="/" className="flex items-center gap-2.5">
        <img src={logo} alt="TaxPal Logo" className="w-10 h-10 drop-shadow-lg" />
        <span className="text-xl font-bold text-white">TaxPal</span>
      </Link>
      <div className="flex gap-4 items-center">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="px-5 py-2.5 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold shadow-md">Dashboard</Link>
            <button onClick={handleLogout} className="px-4 py-2 text-white hover:text-gray-200 font-medium">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 text-white hover:text-gray-200 font-medium">Sign in</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold shadow-md">Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
