import React, { useState, useEffect } from 'react';
import FooterCredit from '../Components/FooterCredit';

const TaxEstimator = () => {

    const [financialYear, setFinancialYear] = useState('2025-26');
    const [isSaving, setIsSaving] = useState(false);
    const [savedPayments, setSavedPayments] = useState(null); 
    const[isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiInsights, setAiInsights] = useState(null);

    const[formData, setFormData] = useState({
        employmentType: 'Business',
        grossIncome: '',
        businessExpenses: '',
        medicalInsurance: '',
        lifeInsurance: '',
        otherDeductions: '',
        tdsDeducted: '' 
    });

    const fetchEstimate = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/taxes/estimate/${financialYear}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            
            if (result.success && result.data) {
                const dbData = result.data;
                setFormData({
                    employmentType: dbData.employmentType || 'Business',
                    grossIncome: dbData.grossIncome || '',
                    businessExpenses: dbData.businessExpenses || '',
                    medicalInsurance: dbData.medicalInsurance || '',
                    lifeInsurance: dbData.lifeInsurance || '',
                    otherDeductions: dbData.otherDeductions || '',
                    tdsDeducted: dbData.tdsDeducted || ''
                });
                setSavedPayments(dbData.payments);
            } else {
                setSavedPayments(null); 
            }
        } catch (error) {
            console.error("Failed to fetch estimate", error);
        }
    };

    useEffect(() => {
        fetchEstimate();
    }, [financialYear]);


    const handleInputChange = (e) => {
        setFormData({ ...formData,[e.target.name]: e.target.value });
    };


    const gross = parseFloat(formData.grossIncome) || 0;
    const deductions = 
        (parseFloat(formData.businessExpenses) || 0) +
        (parseFloat(formData.medicalInsurance) || 0) +
        (parseFloat(formData.lifeInsurance) || 0) +
        (parseFloat(formData.otherDeductions) || 0);

    let taxableIncome = Math.max(0, gross - deductions);
    let totalTax = 0;
    let remainingIncome = taxableIncome;

    if (remainingIncome > 2000000) { totalTax += (remainingIncome - 2000000) * 0.20; remainingIncome = 2000000; }
    if (remainingIncome > 1000000) { totalTax += (remainingIncome - 1000000) * 0.15; remainingIncome = 1000000; }
    if (remainingIncome > 500000) { totalTax += (remainingIncome - 500000) * 0.10; remainingIncome = 500000; }
    if (remainingIncome > 250000) { totalTax += (remainingIncome - 250000) * 0.05; }

    const tds = formData.employmentType === 'Salaried' ? (parseFloat(formData.tdsDeducted) || 0) : 0;
    const finalTaxPayable = Math.max(0, totalTax - tds);

    const q1 = finalTaxPayable * 0.15;
    const q2 = finalTaxPayable * 0.45;
    const q3 = finalTaxPayable * 0.75;
    const q4 = finalTaxPayable * 1;




    // --- AI TAX OPTIMIZER ENGINE (INDIAN CONTEXT) ---
    const generateTaxInsights = () => {
        setIsAnalyzing(true);
        setAiInsights(null);

        // Simulate AI "thinking" time for the UX effect
        setTimeout(() => {
            const insights =[];
            const sec80C_Max = 150000;
            const sec80D_Max = 25000;
            
            const current80C = parseFloat(formData.lifeInsurance) || 0;
            const current80D = parseFloat(formData.medicalInsurance) || 0;
            const grossInc = parseFloat(formData.grossIncome) || 0;
            const bizExp = parseFloat(formData.businessExpenses) || 0;

            // 1. Section 80C Analysis (Life Insurance / PPF)
            if (current80C < sec80C_Max) {
                const gap = sec80C_Max - current80C;
                // Assuming they are in the 20% bracket for the savings calculation
                const potentialSavings = (gap * 0.20); 
                insights.push({
                    title: "Section 80C (PPF/ELSS/Life Insurance)",
                    type: "warning",
                    text: `You have ₹${gap.toLocaleString('en-IN')} left in your 80C limit! Invest this before March 31, 2026 (in 3 days!) to save up to ₹${potentialSavings.toLocaleString('en-IN')} in pure tax.`
                });
            } else {
                insights.push({
                    title: "Section 80C Fully Utilized",
                    type: "success",
                    text: "Great job! You have fully maximized your ₹1.5 Lakh limit under Section 80C."
                });
            }

            // 2. Section 80D Analysis (Medical)
            if (current80D < sec80D_Max) {
                const gap = sec80D_Max - current80D;
                insights.push({
                    title: "Section 80D (Health Insurance)",
                    type: "info",
                    text: `You can still claim ₹${gap.toLocaleString('en-IN')} for health insurance premiums. Protect your family and lower your taxable income simultaneously.`
                });
            }

            // 3. Business Expenses Analysis
            if (formData.employmentType === 'Business' && grossInc > 500000 && bizExp < (grossInc * 0.10)) {
                insights.push({
                    title: "Business Expense Tracking",
                    type: "info",
                    text: "Your declared business expenses are unusually low (<10% of gross). Make sure you are logging internet bills, depreciation on your laptop, and home office rent!"
                });
            }

            setAiInsights(insights);
            setIsAnalyzing(false);
        }, 1800); // 1.8 second delay for realism
    };





    // --- SAVE ESTIMATE TO DATABASE ---
    const handleSaveEstimate = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const calculatedData = { totalTax, finalTaxPayable, q1, q2, q3, q4 };
            
            const response = await fetch('/api/taxes/estimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ financialYear, formData, calculatedData })
            });

            const result = await response.json();
            if (result.success) {
                alert("Estimate Saved Successfully!");
                setSavedPayments(result.data.payments); // Update payment statuses
            } else {
                alert(result.message || "Failed to save");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // --- MARK QUARTER AS PAID ---
    const handleTogglePayment = async (quarter, currentStatus) => {
        if (!savedPayments) {
            alert("Please Save the Estimate first before tracking payments!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/taxes/payment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ financialYear, quarter, isPaid: !currentStatus })
            });

            const result = await response.json();
            if (result.success) {
                // Update local state to reflect change instantly
                setSavedPayments({
                    ...savedPayments,
                    [quarter]: { ...savedPayments[quarter], isPaid: !currentStatus }
                });
            }
        } catch (error) {
            console.error("Payment update failed", error);
        }
    };

    // Helper formatting
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    // Helper component for Quarter Box
    // Helper component for Quarter Box
    const QuarterBox = ({ id, title, date, amount, percentage }) => {
        const isPaid = savedPayments ? savedPayments[id]?.isPaid : false;
        
        return (
            <div className={`glass-panel p-4 rounded-xl border relative overflow-hidden transition-all flex flex-col justify-between ${isPaid ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 hover:border-blue-500/30'}`}>
                <div>
                    <div className="text-xs text-slate-400 mb-1">{title} ({percentage}%)</div>
                    <div className="text-sm font-bold text-white mb-3">{date}</div>
                </div>
                
                {/* FIXED: Stacked vertically with space-y-3 and made button w-full */}
                <div className="mt-2 space-y-3">
                    <div className={`text-xl font-bold truncate ${isPaid ? 'text-emerald-400 opacity-50 line-through' : 'text-blue-400'}`}>
                        {formatCurrency(amount)}
                    </div>
                    <button 
                        onClick={() => handleTogglePayment(id, isPaid)}
                        className={`w-full py-2 rounded-md text-xs font-bold transition-colors ${isPaid ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20'}`}
                    >
                        {isPaid ? 'Paid ✓' : 'Mark as Paid'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 h-screen overflow-y-auto z-10 relative block pb-20">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="header-text text-3xl font-bold text-white">Direct Tax Estimator</h1>
                    <p className="text-slate-400 mt-1 text-sm">Calculate and track your advance tax payments.</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Calculator */}
                <div className="lg:col-span-8 space-y-8">
                    
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex-shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400">person</span>
                                Taxpayer Profile
                            </h3>
                            <span className="px-3 py-1 rounded bg-[#131620] border border-white/10 text-slate-300 text-xs font-medium">FY: {financialYear}</span>
                        </div>
                        
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Employment Type</label>
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <button type="button" onClick={() => setFormData({...formData, employmentType: 'Business', tdsDeducted: ''})} className={`py-3 rounded-lg text-sm font-bold border transition-all ${formData.employmentType === 'Business' ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>Business / Freelance</button>
                                    <button type="button" onClick={() => setFormData({...formData, employmentType: 'Salaried'})} className={`py-3 rounded-lg text-sm font-bold border transition-all ${formData.employmentType === 'Salaried' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>Salaried</button>
                                </div>
                            </div>
                            
                            <hr className="border-white/5 my-4" />
                            
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-white">Income &amp; Deductions</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400">Gross Income</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                            <input type="number" min="0" name="grossIncome" value={formData.grossIncome} onChange={handleInputChange} className="w-full rounded-lg input-glass py-3 pl-8 pr-4 text-sm" placeholder="0" />
                                        </div>
                                    </div>

                                    {formData.employmentType === 'Salaried' && (
                                        <div className="space-y-2">
                                            <label className="text-xs text-emerald-400">TDS Already Deducted</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">₹</span>
                                                <input type="number" min="0" name="tdsDeducted" value={formData.tdsDeducted} onChange={handleInputChange} className="w-full rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 py-3 pl-8 pr-4 text-sm placeholder-emerald-800/50" placeholder="0" />
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="space-y-2"><label className="text-xs text-slate-400">Business Expenses</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span><input type="number" min="0" name="businessExpenses" value={formData.businessExpenses} onChange={handleInputChange} className="w-full rounded-lg input-glass py-3 pl-8 pr-4 text-sm" placeholder="0" /></div></div>
                                    <div className="space-y-2"><label className="text-xs text-slate-400">Medical Insurance</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span><input type="number" min="0" name="medicalInsurance" value={formData.medicalInsurance} onChange={handleInputChange} className="w-full rounded-lg input-glass py-3 pl-8 pr-4 text-sm" placeholder="0" /></div></div>
                                    <div className="space-y-2"><label className="text-xs text-slate-400">Life Insurance / PPF</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span><input type="number" min="0" name="lifeInsurance" value={formData.lifeInsurance} onChange={handleInputChange} className="w-full rounded-lg input-glass py-3 pl-8 pr-4 text-sm" placeholder="0" /></div></div>
                                    <div className="space-y-2"><label className="text-xs text-slate-400">Other Deductions</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span><input type="number" min="0" name="otherDeductions" value={formData.otherDeductions} onChange={handleInputChange} className="w-full rounded-lg input-glass py-3 pl-8 pr-4 text-sm" placeholder="0" /></div></div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Tax Tracker Calendar */}
                    <div className="glass-panel rounded-2xl overflow-hidden mb-6 flex-shrink-0">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#131620]/50">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-400">event_upcoming</span>
                                Payment Tracker
                            </h3>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <QuarterBox id="q1" title="Quarter 1" date="15th June" amount={q1} percentage={15} />
                                <QuarterBox id="q2" title="Quarter 2" date="15th Sept" amount={q2} percentage={45} />
                                <QuarterBox id="q3" title="Quarter 3" date="15th Dec" amount={q3} percentage={75} />
                                <QuarterBox id="q4" title="Quarter 4" date="15th March" amount={q4} percentage={100} />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Column: Dynamic Tax Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-8 rounded-2xl sticky top-24 border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.05)]">
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="text-lg font-bold text-white">Tax Summary</h3>
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-lg shadow-orange-500/10">
                                <span className="material-symbols-outlined text-orange-400">receipt_long</span>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm"><span className="text-slate-400">Gross Income</span><span className="text-white font-medium">{formatCurrency(gross)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-400">Total Deductions</span><span className="text-red-400 font-medium">-{formatCurrency(deductions)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-400">Taxable Income</span><span className="text-white font-bold">{formatCurrency(taxableIncome)}</span></div>
                            
                            <div className="h-px bg-white/10 my-4"></div>

                            <div className="flex justify-between text-sm"><span className="text-slate-400">Total Tax</span><span className="text-white font-medium">{formatCurrency(totalTax)}</span></div>

                            {formData.employmentType === 'Salaried' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-emerald-400">TDS Deducted</span>
                                    <span className="text-emerald-400 font-medium">-{formatCurrency(tds)}</span>
                                </div>
                            )}
                            
                            <div className="bg-[#131620] p-4 rounded-xl border border-white/5 mt-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-slate-300 font-bold">Remaining Tax</span>
                                    <span className="text-2xl text-orange-400 font-bold header-text">{formatCurrency(finalTaxPayable)}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 text-right mt-1">To be paid via Quarters</p>
                            </div>

                            {/* --- THE NEW SAVE BUTTON --- */}
                            <button 
                                onClick={handleSaveEstimate} 
                                disabled={isSaving}
                                className="w-full mt-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : (savedPayments ? 'Update Saved Estimate' : 'Save Estimate to Profile')}
                            </button>

                        </div>
                        {/* ✨ AI Tax Optimizer Widget */}
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-purple-500/30 bg-gradient-to-br from-[#131620] to-purple-900/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] mt-6">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse"></div>
                        
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="p-2 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 shadow-lg shadow-purple-500/30 text-white flex-shrink-0">
                                <span className={`material-symbols-outlined ${isAnalyzing ? 'animate-spin' : 'animate-bounce'}`}>
                                    {isAnalyzing ? 'refresh' : 'auto_awesome'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                    Smart Tax Optimizer
                                </h3>
                                <p className="text-[11px] text-slate-400">Powered by TaxPal AI</p>
                            </div>
                        </div>

                        <div className="relative z-10">
                            {!aiInsights && !isAnalyzing ? (
                                <div>
                                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                        Let AI scan your inputs against the Income Tax Act, 1961 to find hidden deductions and save you money.
                                    </p>
                                    <button 
                                        onClick={generateTaxInsights}
                                        className="w-full py-2.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 text-purple-300 text-sm font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                    >
                                        Analyze My Tax Plan
                                    </button>
                                </div>
                            ) : isAnalyzing ? (
                                <div className="space-y-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs text-purple-400 animate-pulse">Scanning Section 80C limits...</p>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-2/3 animate-pulse rounded-full"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 mt-4 animate-fade-in">
                                    {aiInsights.map((insight, idx) => (
                                        <div key={idx} className={`p-3 rounded-xl border ${
                                            insight.type === 'warning' ? 'bg-orange-500/10 border-orange-500/20 border-l-4 border-l-orange-500' :
                                            insight.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 border-l-4 border-l-emerald-500' :
                                            'bg-blue-500/10 border-blue-500/20 border-l-4 border-l-blue-500'
                                        }`}>
                                            <h4 className={`text-xs font-bold mb-1 ${
                                                insight.type === 'warning' ? 'text-orange-400' :
                                                insight.type === 'success' ? 'text-emerald-400' : 'text-blue-400'
                                            }`}>{insight.title}</h4>
                                            <p className="text-xs text-slate-300 leading-relaxed">{insight.text}</p>
                                        </div>
                                    ))}
                                    
                                    <button 
                                        onClick={generateTaxInsights}
                                        className="w-full mt-2 py-2 text-[11px] text-slate-400 hover:text-purple-400 transition-colors uppercase tracking-wider font-bold"
                                    >
                                        <span className="material-symbols-outlined text-[14px] align-middle mr-1">refresh</span>
                                        Recalculate
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/5 mt-auto pt-6 flex-shrink-0">
                <FooterCredit />
            </div>
        </main>
    );
};

export default TaxEstimator;