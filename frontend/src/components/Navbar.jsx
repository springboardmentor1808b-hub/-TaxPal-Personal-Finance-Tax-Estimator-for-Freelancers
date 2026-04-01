import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, LayoutDashboard, Settings, LogOut} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/register", { replace: true });
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "#features" },
    { name: "Pricing", path: "#pricing" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
      scrolled
        ? "bg-white/90 backdrop-blur-xl border-b border-purple-100 py-3 shadow-sm"
        : "bg-transparent py-6"
    }`}>
      
      <div className="flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-[110] group">
          <div className="w-10 h-10 bg-[#6d28d9] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
            TP
          </div>
          <span className="text-2xl font-black italic text-[#1e1b4b] tracking-tighter">
            TaxPal
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">

          <div className="flex gap-10 text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="hover:text-[#6d28d9] transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#6d28d9] transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4 border-l border-purple-100 pl-8">
            {!user ? (
            <>
            <button
              onClick={() => navigate('/login')}
              className="text-[#1e1b4b] text-[13px] font-black uppercase tracking-widest hover:text-[#6d28d9] transition-colors px-4"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate('/register')}
              className="bg-[#6d28d9] text-white px-7 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-purple-100 hover:bg-[#5b21b6] hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </button>
            </>

              ) : (

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 transition-all shadow-sm group"
              >

              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-[#6d28d9] font-black">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>

              <span className="text-sm font-black text-[#1e1b4b]">
                {user.fullName}
              </span>

              <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />

              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-purple-50 p-2">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold hover:bg-purple-50 text-slate-700"
                  >
                    Dashboard
                   <LayoutDashboard size={16} />
                  </button>

                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold hover:bg-purple-50 text-slate-700"
                  >
                    Settings
                    <Settings size={16} />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50"
                  >
                  Log Out
                  <LogOut size={16} />
                  </button>

              </div>
            )}

          </div>

          )}

          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-3 rounded-2xl bg-purple-50 text-[#6d28d9] transition-all z-[110]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#1e1b4b]/40 backdrop-blur-sm lg:hidden z-[100]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-white lg:hidden z-[105] shadow-2xl flex flex-col p-8"
            >

              <div className="mt-20 flex flex-col gap-6 flex-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="text-3xl font-black text-[#1e1b4b] italic hover:text-[#6d28d9] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="mt-auto space-y-3">

                <button
                  onClick={() => navigate('/login')}
                  className="w-full text-[#1e1b4b] py-5 rounded-2xl font-black uppercase tracking-widest text-xs border border-purple-100"
                >
                  Sign In
                </button>

                <button
                  onClick={() => navigate('/register')}
                  className="w-full bg-[#6d28d9] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-100"
                >
                  Get Started
                </button>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </nav>
  );
}
