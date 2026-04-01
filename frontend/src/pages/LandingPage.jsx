import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, Zap, TrendingUp, Clock, ArrowRight,
  Twitter, Github, Linkedin, Instagram
} from 'lucide-react';
import Navbar from "../components/Navbar";

// --- Sub-Component: Feature Card ---
const FeatureCard = ({ icon, title, desc, iconBg }) => (
  <div className="p-8 md:p-10 bg-white border border-purple-50 rounded-[2.5rem] hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-500 hover:-translate-y-2 group">
    <div className={`${iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-8 text-[#6d28d9] group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 text-[#1e1b4b] tracking-tight">{title}</h3>
    <p className="text-slate-500 font-medium text-[16px] leading-relaxed">{desc}</p>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-[#1e1b4b] overflow-x-hidden selection:bg-purple-200 selection:text-[#6d28d9]">
      <Navbar />

      {/* Hero Section - Matching the Light Purple Navbar */}
      <section className="relative pt-32 md:pt-48 pb-16 md:pb-32 px-6 overflow-hidden bg-[#f3e8ff]">
        {/* Decorative radial gradient for depth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15)_0%,_rgba(243,232,255,0)_70%)] -z-10" />

        <div className="max-w-6xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-white/80 backdrop-blur-sm shadow-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-[#6d28d9] animate-pulse" />
            <span className="text-[11px] md:text-[12px] font-bold text-[#6d28d9] tracking-wider uppercase">Trusted by 50,000+ freelancers</span>
          </div>

          <h1 className="text-5xl md:text-[85px] font-black leading-[0.9] tracking-tighter mb-8 text-[#1e1b4b]">
            Accounting
            <span className="relative inline-block mx-2 md:mx-4 text-[#6d28d9] italic">
              made
              <span className="absolute bottom-2 left-0 w-full h-[15px] bg-white/40 -z-10 rounded-full" />
            </span>
            <br className="hidden md:block" />
            <span className="relative inline-block mr-2 md:mr-4 text-[#6d28d9] italic">
              simple
              <span className="absolute bottom-2 left-0 w-full h-[15px] bg-white/40 -z-10 rounded-full" />
            </span>
            for everyone.
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto mb-12 text-lg md:text-xl font-medium leading-relaxed px-4">
            TaxPal automates your bookkeeping, tracks every deduction, and files your taxes so you can focus on what you love.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-[#6d28d9] text-white px-10 py-4 rounded-2xl font-bold text-[17px] shadow-2xl shadow-purple-300/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              Start for free <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 md:py-32 scroll-mt-16">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-[#1e1b4b]">Everything you need to run your business</h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">We've built TaxPal with the best tools and practices to help you focus on what matters: your business.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Shield size={24} />}
            iconBg="bg-purple-100"
            title="Tax Deduction"
            desc="Our AI scans your accounts to find hidden tax breaks you might have missed."
          />
          <FeatureCard
            icon={<Zap size={24} />}
            iconBg="bg-blue-50"
            title="Auto-Sync"
            desc="Securely connect over 10,000+ banks to categorize your spending in real-time."
          />
          <FeatureCard
            icon={<TrendingUp size={24} />}
            iconBg="bg-purple-100"
            title="Profit Tracking"
            desc="Visual charts that show exactly where your money is going every month."
          />
          <FeatureCard
            icon={<Clock size={24} />}
            iconBg="bg-orange-50"
            title="Instant Invoicing"
            desc="Send professional invoices and get paid faster with built-in payment links."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] rounded-[3rem] p-10 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-purple-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter italic">Ready to simplify?</h2>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-[#6d28d9] px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-xl"
          >
            Get TaxPal Today
          </button>
          <p className="mt-6 text-purple-100 font-bold text-sm uppercase tracking-widest">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 bg-[#1e1b4b] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pb-20">
            <div className="md:col-span-6">
              <h2 className="text-3xl font-black italic tracking-tighter mb-8">TaxPal</h2>
              <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
                Built for freelancers, small business owners, and creators. We make taxes the easiest part of your job.
              </p>
              <div className="flex gap-4 mt-10">
                {[Twitter, Github, Linkedin, Instagram].map((Icon, idx) => (
                  <a key={idx} href="#" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-[#6d28d9] transition-all">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-400 mb-8">Platform</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
                <li><a href="#features" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-400 mb-8">Support</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
                <li><Link to="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center md:text-left">
            <p>© 2026 TAXPAL INC</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;