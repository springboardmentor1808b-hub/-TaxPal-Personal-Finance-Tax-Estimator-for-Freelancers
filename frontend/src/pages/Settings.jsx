import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Database, Bell, Shield, ChevronRight, Trash2, Plus, X, Check, Eye, EyeOff, BellRing, Mail, Smartphone, Globe } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';
import { updateProfile } from "../services/authService";

const CAT_COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#0EA5E9', '#A855F7', '#64748B'];
const TABS = [
    { key: 'Profile', icon: User },
    { key: 'Categories', icon: Database },
    { key: 'Notifications', icon: Bell },
    { key: 'Security', icon: Shield },
];

export default function Settings() {
    const [tab, setTab] = useState('Categories');

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-0.5">Settings</h1>
                <p className="label">Manage your account settings and preferences</p>
            </div>

            <div className="flex flex-col xl:flex-row gap-5 items-start">
                {/* Sidebar tabs */}
                <div className="w-full xl:w-52 card p-2 shrink-0">
                    {/* mobile: horizontal scroll */}
                    <div className="flex xl:flex-col gap-1 overflow-x-auto">
                        {TABS.map(({ key, icon: Icon }) => {
                            const active = tab === key;
                            return (
                                <button key={key} onClick={() => setTab(key)}
                                    className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl whitespace-nowrap flex-shrink-0"
                                    style={{ background: active ? '#0F172A' : 'transparent', color: active ? 'white' : '#64748B', minWidth: 0 }}
                                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#0F172A'; } }}
                                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; } }}>
                                    <Icon size={16} style={{ color: active ? 'var(--accent)' : 'inherit', flexShrink: 0 }} />
                                    <span className="text-[12px] font-semibold">{key}</span>
                                    {active && <ChevronRight size={12} className="ml-auto opacity-30 hidden xl:block" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Panel */}
                <div className="flex-1 card p-6 min-h-[480px] w-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        {tab === 'Categories' && <CategoriesPanel key="cat" />}
                        {tab === 'Profile' && <ProfilePanel key="profile" />}
                        {tab === 'Notifications' && <NotifsPanel key="notifs" />}
                        {tab === 'Security' && <SecurityPanel key="sec" />}
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    );
}

// ─── Categories ──────────────────────────────────────────────────────────────
function CategoriesPanel() {
    const { expenseCategories, addExpenseCategory, deleteExpenseCategory, incomeCategories, addIncomeCategory, deleteIncomeCategory } = useAppContext();
    const [catTab, setCatTab] = useState('Expense');
    const [showAdd, setShowAdd] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', color: CAT_COLORS[0] });

    const cats = catTab === 'Expense' ? expenseCategories : incomeCategories;
    const addFn = catTab === 'Expense' ? addExpenseCategory : addIncomeCategory;
    const delFn = catTab === 'Expense' ? deleteExpenseCategory : deleteIncomeCategory;

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newCat.name.trim()) return;
        addFn({ name: newCat.name, color: newCat.color });
        setNewCat({ name: '', color: CAT_COLORS[Math.floor(Math.random() * CAT_COLORS.length)] });
        setShowAdd(false);
    };

    return (
        <Panel title="Category Management" action={
            <button className="btn-primary px-4 py-2.5 text-[11px]" onClick={() => setShowAdd(s => !s)}>
                <Plus size={13} /> Add
            </button>
        }>
            {/* Sub tabs */}
            <div className="flex gap-1 p-1 rounded-xl w-fit mb-5" style={{ background: '#F1F5F9' }}>
                {['Expense', 'Income'].map(t => (
                    <button key={t} onClick={() => setCatTab(t)}
                        className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                        style={{ background: catTab === t ? 'white' : 'transparent', color: catTab === t ? '#0F172A' : '#94A3B8', boxShadow: catTab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                        {t}
                    </button>
                ))}
            </div>

            {/* Add form */}
            <AnimatePresence>
                {showAdd && (
                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAdd} className="overflow-hidden mb-4">
                        <div className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-end gap-4 flex-wrap" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                            <div className="flex-1 min-w-36">
                                <label className="label mb-1.5 block">Name</label>
                                <input value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))} placeholder="Category name" className="form-input" />
                            </div>
                            <div>
                                <label className="label mb-2 block">Color</label>
                                <div className="flex gap-1.5 flex-wrap">
                                    {CAT_COLORS.map(c => (
                                        <button key={c} type="button" onClick={() => setNewCat(p => ({ ...p, color: c }))}
                                            className="w-6 h-6 rounded-full"
                                            style={{ background: c, transform: newCat.color === c ? 'scale(1.3)' : 'scale(1)', outline: newCat.color === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="btn-primary px-4 py-2.5 text-[11px]"><Check size={13} /> Add</button>
                                <button type="button" onClick={() => setShowAdd(false)} className="icon-btn"><X size={15} /></button>
                            </div>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="space-y-1.5">
                <AnimatePresence>
                    {cats.map(cat => (
                        <motion.div key={cat.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center justify-between px-4 py-3 rounded-xl group transition-all"
                            style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.boxShadow = 'none'; }}>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                                <span className="text-[13px] font-bold text-slate-900">{cat.name}</span>
                            </div>
                            <button onClick={() => delFn(cat.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                style={{ color: '#CBD5E1' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--expense-light)'; e.currentTarget.style.color = 'var(--expense)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CBD5E1'; }}>
                                <Trash2 size={13} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </Panel>
    );
}

// ─── Profile ─────────────────────────────────────────────────────────────────
function ProfilePanel() {
    const [profile, setProfile] = useState({ name: "", email: "", country: "", bracket: "" });
    const [saved, setSaved] = useState(false);

     React.useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const user = JSON.parse(storedUser);

            setProfile({
                name: user.fullName || "",
                email: user.email || "",
                country: user.country || "",
                bracket: user.incomeBracket || ""
            });
        }

    }, []);

    const set = (k, v) => setProfile(p => ({ ...p, [k]: v }));

      // ================= UPDATE PROFILE =================
    const handleSave = async () => {

        try {

            const res = await updateProfile({
                fullName: profile.name,
                email: profile.email,
                country: profile.country,
                incomeBracket: profile.bracket
            });

            if (res.user) {
                localStorage.setItem("user", JSON.stringify(res.user));
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);

        } catch (err) {
            alert("Failed to update profile");
        }

    };

    return (
        <Panel title="Profile Settings">
            <div className="flex flex-col sm:flex-row items-start gap-5 p-4 rounded-xl mb-6" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                <img src={'https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}'} alt="Avatar" className="w-14 h-14 rounded-xl object-cover shrink-0" style={{ background: '#E2E8F0' }} />
                <div>
                    <p className="text-[15px] font-black text-slate-900">{profile.name}</p>
                    <p className="label mt-0.5">{profile.email}</p>
                    <button className="btn-secondary px-3.5 py-2 text-[11px] mt-2.5">Change Avatar</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Field label="Full Name"><input className="form-input" value={profile.name} onChange={e => set('name', e.target.value)} /></Field>
                <Field label="Email"><input type="email" className="form-input" value={profile.email} onChange={e => set('email', e.target.value)} /></Field>
                <Field label="Country">
                    <select className="form-input" value={profile.country} onChange={e => set('country', e.target.value)}>
                        {['United States', 'Canada', 'United Kingdom', 'India', 'Australia'].map(c => <option key={c}>{c}</option>)}
                    </select>
                </Field>
                <Field label="Income Bracket">
                    <select className="form-input" value={profile.bracket} onChange={e => set('bracket', e.target.value)}>
                        {['< $25,000', '$25,000 – $50,000', '$50,000 – $100,000', '$100,000 – $200,000', '> $200,000'].map(b => <option key={b}>{b}</option>)}
                    </select>
                </Field>
            </div>

             <button
                onClick={handleSave}
                className="btn-primary"
                style={saved
                    ? { background: 'var(--income)', boxShadow: '0 2px 10px rgba(16,185,129,0.25)' }
                    : {}
                }
            >
                {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
            </button>
        </Panel>
    );
}

// ─── Notifications ────────────────────────────────────────────────────────────
function NotifsPanel() {
    const [notifs, setNotifs] = useState({ deadlines: true, weekly: true, budget: true, email: false, sms: false });
    const toggle = k => setNotifs(p => ({ ...p, [k]: !p[k] }));

    const items = [
        { key: 'deadlines', icon: BellRing, title: 'Tax Deadline Reminders', desc: 'Alerts before quarterly payments are due.' },
        { key: 'weekly', icon: Mail, title: 'Weekly Summary', desc: 'Weekly digest of income & expenses.' },
        { key: 'budget', icon: Globe, title: 'Budget Limit Alerts', desc: 'Alert when spending approaches limits.' },
        { key: 'email', icon: Mail, title: 'Monthly Email Digest', desc: 'Monthly deep-dive report to inbox.' },
        { key: 'sms', icon: Smartphone, title: 'SMS Alerts', desc: 'Critical alerts via text message.' },
    ];

    return (
        <Panel title="Notification Preferences">
            <div className="space-y-2.5">
                {items.map(({ key, icon: Icon, title, desc }) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl transition-all"
                        style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#94A3B8' }}>
                                <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[13px] font-bold text-slate-900">{title}</p>
                                <p className="text-[11px] font-medium text-slate-400 truncate">{desc}</p>
                            </div>
                        </div>
                        <button onClick={() => toggle(key)} className="toggle shrink-0" style={{ background: notifs[key] ? 'var(--accent)' : '#E2E8F0' }}>
                            <div className="toggle-thumb" style={{ left: notifs[key] ? 22 : 4 }} />
                        </button>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

// ─── Security ─────────────────────────────────────────────────────────────────
function SecurityPanel() {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [changed, setChanged] = useState(false);

    return (
        <Panel title="Security Settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <p className="label">Change Password</p>
                    <Field label="Current Password">
                        <div className="relative">
                            <input type={showOld ? 'text' : 'password'} className="form-input pr-11" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowOld(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-700">
                                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </Field>
                    <Field label="New Password">
                        <div className="relative">
                            <input type={showNew ? 'text' : 'password'} className="form-input pr-11" placeholder="Min. 8 characters" />
                            <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-700">
                                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </Field>
                    <button onClick={() => { setChanged(true); setTimeout(() => setChanged(false), 2000); }}
                        className="btn-primary"
                        style={changed ? { background: 'var(--income)', boxShadow: '0 2px 10px rgba(16,185,129,0.25)' } : {}}>
                        {changed ? <><Check size={14} /> Updated!</> : 'Update Password'}
                    </button>
                </div>

                <div className="space-y-2.5">
                    <p className="label mb-1">Security Features</p>
                    {[
                        { title: 'Two-Factor Authentication', desc: 'Extra layer of security', active: false },
                        { title: 'Login Notifications', desc: 'Alerts on new sign-ins', active: true },
                        { title: 'Session Timeout', desc: 'Auto logout after 30 min', active: true },
                    ].map(item => (
                        <div key={item.title} className="flex justify-between items-start p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                            <div>
                                <p className="text-[13px] font-bold text-slate-900 mb-0.5">{item.title}</p>
                                <p className="text-[11px] font-medium text-slate-400">{item.desc}</p>
                            </div>
                            <span className={`badge ${item.active ? 'badge-income' : 'badge-neutral'} shrink-0 ml-3`}>
                                {item.active ? 'Active' : 'Disabled'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Panel>
    );
}

// ─── Shared ───────────────────────────────────────────────────────────────────
function Panel({ title, action, children }) {
    return (
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-[17px] font-black text-slate-900">{title}</h3>
                {action}
            </div>
            {children}
        </motion.div>
    );
}
const Field = ({ label, children }) => (
    <div>
        <label className="label mb-1.5 block">{label}</label>
        {children}
    </div>
);
