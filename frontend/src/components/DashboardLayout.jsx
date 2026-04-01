import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {LayoutDashboard, Receipt, Wallet, PieChart,FileText, Settings, LogOut, Bell, X, ChevronRight, Menu} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: Wallet, label: 'Budgets', path: '/budgets' },
    { icon: PieChart, label: 'Tax Estimator', path: '/tax-estimator' },
    { icon: FileText, label: 'Reports', path: '/reports' },
];

function SidebarContent({ navigate, location, onClose, user }) {

       const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    return (
        <div className="flex flex-col h-full" style={{ background: 'var(--sidebar-bg)' }}>
            {/* Logo */}
            <div className="px-5 pt-6 pb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { navigate('/'); onClose?.(); }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs"
                        style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}>
                        TP
                    </div>
                    <span className="text-white font-black text-[20px] tracking-tight">TaxPal</span>
                </div>
                {onClose && (
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#64748B' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="mx-5 h-px mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(100,116,139,1)' }}>
                    Main Menu
                </p>
                {NAV.map(item => {
                    const active = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <button key={item.path} onClick={() => { navigate(item.path); onClose?.(); }}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left relative"
                            style={{ background: active ? 'rgba(255,255,255,0.1)' : 'transparent', color: active ? '#fff' : 'rgba(148,163,184,1)' }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e2e8f0'; } }}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,1)'; } }}>
                            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: '#6366F1' }} />}
                            <Icon size={18} style={{ color: active ? '#6366F1' : 'inherit', flexShrink: 0 }} />
                            <span className="text-[13px] font-semibold">{item.label}</span>
                            {active && <ChevronRight size={13} className="ml-auto opacity-30" />}
                        </button>
                    );
                })}
            </nav>

            <div className="mx-5 h-px my-4" style={{ background: 'rgba(255,255,255,0.06)' }} />

            {/* Logged User */}
            <div className="px-3 pb-5">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <img  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'User'}`}
                        alt="user" className="w-8 h-8 rounded-lg object-cover shrink-0" style={{ background: '#1E293B' }} />
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-[12px] font-bold truncate">{user?.fullName || "User"}</p>
                        <p className="text-[10px] truncate" style={{ color: '#64748B' }}>{user?.email || "user@email.com"}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => { navigate('/settings'); onClose?.(); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest"
                        style={{ background: 'rgba(255,255,255,0.07)', color: '#94A3B8' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#94A3B8'; }}>
                        <Settings size={12} /> Settings
                    </button>
                    <button onClick={handleLogout}
                        className="w-9 flex items-center justify-center rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.07)', color: '#94A3B8' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; e.currentTarget.style.color = '#F43F5E'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#94A3B8'; }}>
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { summary, budgets } = useAppContext();

    const [user, setUser] = useState(null);
    const [showNotif, setShowNotif] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

     useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
     const token = localStorage.getItem("token");
        if (!token) {
        navigate("/login", { replace: true });
        }
     }, [navigate]);

    const currentPage = NAV.find(m => m.path === location.pathname)?.label ?? 'Settings';

    const overBudget = budgets.filter(b => (b.spent / b.limit) > 0.85);
    const notifications = [
        ...overBudget.map(b => ({ id: b.id, type: 'warning', title: 'Budget Alert', msg: `${b.name} is at ${Math.round((b.spent / b.limit) * 100)}% of its limit.` })),
        { id: 'tax', type: 'info', title: 'Upcoming Deadline', msg: 'Q2 estimated tax payment due Jun 16, 2025.' },
        { id: 'net', type: 'success', title: 'Net Earnings', msg: `Current net: $${summary.netEarnings.toLocaleString('en-US', { maximumFractionDigits: 0 })}` },
    ];

    return (
        <div className="flex min-h-screen" style={{ background: 'var(--bg-page)' }}>

            {/* ── DESKTOP SIDEBAR ────────────────────────── */}
            <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-50 w-64" style={{ background: 'var(--sidebar-bg)' }}>
                <SidebarContent navigate={navigate} location={location} user={user} />
            </aside>

            {/* ── MOBILE SIDEBAR DRAWER ──────────────────── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
                            onClick={() => setSidebarOpen(false)} />
                        <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 35 }}
                            className="fixed top-0 left-0 h-screen z-50 w-72 lg:hidden">
                            <SidebarContent navigate={navigate} location={location} user={user} onClose={() => setSidebarOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── MAIN AREA ────────────────────────────────── */}
            <div className="flex-1 flex flex-col lg:ml-64">

                {/* Topbar */}
                <header className="h-14 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6"
                    style={{ background: 'rgba(240,242,248,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button className="lg:hidden icon-btn" onClick={() => setSidebarOpen(true)}>
                            <Menu size={18} />
                        </button>
                        {/* Breadcrumb */}
                        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                            <span>Home</span>
                            <ChevronRight size={11} />
                            <span className="text-slate-800 font-bold">{currentPage}</span>
                        </div>
                        <span className="sm:hidden text-[14px] font-black text-slate-900">{currentPage}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Net earnings pill */}
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                            style={{ background: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Net</span>
                            <span className="text-[13px] font-black" style={{ color: summary.netEarnings >= 0 ? 'var(--income)' : 'var(--expense)' }}>
                                ${Math.abs(summary.netEarnings).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </span>
                        </div>

                        {/* Bell */}
                        <div className="relative">
                            <button onClick={() => setShowNotif(s => !s)} className="icon-btn" style={{ position: 'relative' }}>
                                <Bell size={16} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full border border-white" style={{ background: 'var(--expense)' }} />
                                )}
                            </button>
                            <AnimatePresence>
                                {showNotif && (
                                    <motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-11 w-72 z-50 overflow-hidden"
                                        style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                                        <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-800">Notifications</p>
                                            <button onClick={() => setShowNotif(false)} className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-800"><X size={13} /></button>
                                        </div>
                                        <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                                            {notifications.map(n => (
                                                <div key={n.id} className="p-3 rounded-xl"
                                                    style={{ background: n.type === 'warning' ? 'var(--warning-light)' : n.type === 'success' ? 'var(--income-light)' : '#F8FAFF', border: `1px solid ${n.type === 'warning' ? '#FDE68A' : n.type === 'success' ? '#A7F3D0' : '#E0E7FF'}` }}>
                                                    <p className="text-[10px] font-black uppercase tracking-wide mb-0.5" style={{ color: n.type === 'warning' ? 'var(--warning)' : n.type === 'success' ? 'var(--income)' : 'var(--accent)' }}>{n.title}</p>
                                                    <p className="text-[12px] font-medium text-slate-600">{n.msg}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 page-content overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
