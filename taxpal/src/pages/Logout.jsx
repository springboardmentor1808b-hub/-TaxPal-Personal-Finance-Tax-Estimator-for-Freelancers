import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logo } from '../assets/assets';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
      window.location.reload();
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <img src={logo} alt="TaxPal Logo" className="w-20 h-20 mx-auto mb-6 relative z-10 drop-shadow-2xl" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">See you soon!</h1>
          <p className="text-white/90 text-lg mb-6">Logging you out securely...</p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
