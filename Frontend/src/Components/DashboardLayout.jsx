import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // --- AI CHATBOT STATE ---
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const[isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm TaxPal AI. The financial year ends in just 3 days (March 31, 2026). How can I help you optimize your taxes today?", isBot: true }
    ]);
    const messagesEndRef = useRef(null);

  
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }
            try {
                const response = await fetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (response.ok) {
                    setUser(result.data);
                } else {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [navigate]);

  
    useEffect(() => {
        if (isChatOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isChatOpen]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    //                                     AI chatbot logics 
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = inputText.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI thinking for 1.5 seconds
        setTimeout(() => {
            let botReply = "I can help you analyze your finances! Try asking me about your 'taxes', 'budget', or 'investments'.";
            const lowerMsg = userMsg.toLowerCase();

            if (lowerMsg.includes('tax') || lowerMsg.includes('advance') || lowerMsg.includes('due')) {
                botReply = "Your next Advance Tax installment (Q1) for FY 2026-27 is due on June 15th. Check the Tax Estimator page for the exact amount!";
            } else if (lowerMsg.includes('80c') || lowerMsg.includes('save') || lowerMsg.includes('invest')) {
                botReply = "You have exactly 3 days left (until March 31, 2026) to claim your ₹1.5L deduction under Section 80C! Consider ELSS, PPF, or Life Insurance immediately to save up to ₹45,000 in tax.";
            } else if (lowerMsg.includes('expense') || lowerMsg.includes('spend') || lowerMsg.includes('budget')) {
                botReply = "To see a detailed breakdown of your spending, visit the Budgets page. I'll automatically warn you if you cross 85% of any category limit!";
            } else if (lowerMsg.includes('report') || lowerMsg.includes('csv')) {
                botReply = "You can download a clean CSV of all your transactions for your CA by heading to the Reports tab!";
            } else if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
                botReply = `Hello ${user?.name.split(' ')[0] || 'there'}! Ready to master your finances today?`;
            }

            setMessages(prev =>[...prev, { text: botReply, isBot: true }]);
            setIsTyping(false);
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F111A] flex items-center justify-center text-white">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0F111A] flex font-sans">
            <div className="bg-grain"></div>
            <div className="glow-orb top-[-20%] left-[-10%] opacity-40"></div>
            <div className="glow-orb-secondary bottom-[-20%] right-[-10%] opacity-30"></div>

            {/* --- SIDEBAR --- */}
            <aside className="w-64 h-screen glass-sidebar fixed left-0 top-0 z-50 flex-col justify-between hidden md:flex">
                <div>
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500/80 to-purple-500/20 border border-blue-400/20 flex items-center justify-center backdrop-blur-sm">
                            <span className="material-symbols-outlined text-white text-[20px]">account_balance_wallet</span>
                        </div>
                        <span className="header-text text-xl font-bold text-white tracking-tight">TaxPal</span>
                    </div>

                    <nav className="mt-8 px-4 space-y-2">
                        <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${isActive('/dashboard') ? 'bg-blue-500/10 border border-blue-500/20 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
                            <span className={`material-symbols-outlined transition-colors ${isActive('/dashboard') ? 'text-blue-400' : 'group-hover:text-blue-400'}`}>dashboard</span>
                            Dashboard
                        </Link>
                        <Link to="/transactions" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${isActive('/transactions') ? 'bg-blue-500/10 border border-blue-500/20 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
                            <span className={`material-symbols-outlined transition-colors ${isActive('/transactions') ? 'text-blue-400' : 'group-hover:text-purple-400'}`}>receipt_long</span>
                            Transactions
                        </Link>
                        <Link to="/budgets" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${isActive('/budgets') ? 'bg-emerald-500/10 border border-emerald-500/20 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
                            <span className={`material-symbols-outlined transition-colors ${isActive('/budgets') ? 'text-emerald-400' : 'group-hover:text-emerald-400'}`}>pie_chart</span>
                            Budgets
                        </Link>
                        <Link to="/tax-estimator" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${isActive('/tax-estimator') ? 'bg-orange-500/10 border border-orange-500/20 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
                            <span className={`material-symbols-outlined transition-colors ${isActive('/tax-estimator') ? 'text-orange-400' : 'group-hover:text-orange-400'}`}>calculate</span>
                            Tax Estimator
                        </Link>
                        <Link to="/reports" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${isActive('/reports') ? 'bg-pink-500/10 border border-pink-500/20 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
                            <span className={`material-symbols-outlined transition-colors ${isActive('/reports') ? 'text-pink-400' : 'group-hover:text-pink-400'}`}>bar_chart</span>
                            Reports
                        </Link>
                    </nav>
                </div>

                <div className="p-4 mt-auto">
                    <Link to="/settings" className="glass-panel p-4 rounded-xl flex items-center gap-3 hover:bg-white/10 cursor-pointer transition-colors border-white/5 group">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-white/10 group-hover:border-blue-400 transition-colors">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">{user.name}</h4>
                            <p className="text-xs text-slate-400 truncate">Freelancer Pro</p>
                        </div>
                        <button onClick={(e) => { e.preventDefault(); handleLogout(); }} title="Logout" className="p-1.5 rounded-lg hover:bg-red-500/20 group/logout transition-colors">
                            <span className="material-symbols-outlined text-slate-500 group-hover/logout:text-red-400 text-lg transition-colors">logout</span>
                        </button>
                    </Link>
                </div>
            </aside>

            {/* --- MOBILE TOP BAR --- */}
            <div className="md:hidden fixed top-0 w-full z-50 glass-sidebar px-4 py-3 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500/80 to-purple-500/20 border border-blue-400/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[20px]">account_balance_wallet</span>
                    </div>
                    <span className="header-text text-lg font-bold text-white">TaxPal</span>
                </div>
                <button className="text-slate-300" onClick={handleLogout}>
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <Outlet context={{ user }} />

            {/*Floating assistant*/}
            {/* Chat Window */}
            {isChatOpen && (
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[450px] bg-[#131620]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.2)] z-[100] flex flex-col overflow-hidden animate-fade-in origin-bottom-right">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/20 to-transparent flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30 text-white">
                                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white leading-tight">TaxPal AI</h3>
                                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-purple-900/5">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                    msg.isBot 
                                        ? 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm' 
                                        : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm shadow-lg shadow-purple-500/20'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        
                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center h-10 w-16 justify-center">
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-3 border-t border-white/10 bg-[#0F111A]">
                        <form onSubmit={handleSendMessage} className="relative flex items-center">
                            <input 
                                type="text" 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ask about taxes, budgets..." 
                                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder-slate-500"
                            />
                            <button 
                                type="submit"
                                disabled={!inputText.trim()}
                                className="absolute right-1.5 w-8 h-8 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px] ml-0.5">send</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] z-[100] transition-transform hover:scale-110 active:scale-95 ${
                    isChatOpen ? 'bg-slate-800 text-slate-400 border border-white/10' : 'bg-gradient-to-tr from-purple-600 to-blue-500 text-white'
                }`}
            >
                <span className="material-symbols-outlined text-[28px]">
                    {isChatOpen ? 'close' : 'smart_toy'}
                </span>
            </button>
            
        </div>
    );
};

export default DashboardLayout;