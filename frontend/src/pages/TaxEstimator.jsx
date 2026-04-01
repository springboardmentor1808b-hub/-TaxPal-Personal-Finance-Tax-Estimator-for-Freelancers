import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, FileText, ChevronRight, ShieldCheck, Calendar, Check, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';
import { calculateIndianTax } from "../utils/indianTax";
import { Download } from "lucide-react";
import jsPDF from "jspdf";

const fmt = (n, dec = 0, country = "US") =>
    new Intl.NumberFormat(
        country === "India" ? "en-IN" : "en-US",
        {
            style: "currency",
            currency: country === "India" ? "INR" : "USD",
            minimumFractionDigits: dec,
            maximumFractionDigits: dec
        }
    ).format(n);

const BRACKETS = [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
];

const STATE_RATES = {
    'California': 0.093,
    'New York': 0.0685,
    'Texas': 0,
    'Florida': 0,
    'Washington': 0,
    'Illinois': 0.0495,

    // Added Indian states (no state income tax in India)
    'West Bengal': 0,
    'Maharashtra': 0,
    'Karnataka': 0,
    'Delhi': 0,
    'Tamil Nadu': 0
};

function calcFederal(income) {
    return BRACKETS.reduce((tax, b) =>
        income > b.min ? tax + (Math.min(income, b.max) - b.min) * b.rate : tax
        , 0);
}

export default function TaxEstimator() {

    const { summary, addTaxCalculation, taxCalculations } = useAppContext();

    const [form, setForm] = useState({
        country: 'United States',
        state: 'California',
        filingStatus: 'Single',
        quarter: 'Q2 (Apr-Jun 2025)',
        grossIncome: String(Math.round(summary.totalIncome)),
        businessExpenses: String(Math.round(summary.totalExpenses)),
        retirement: '',
        health: '',
        homeOffice: '',
    });

    const [result, setResult] = useState(null);
    const [saved, setSaved] = useState(false);
    const [showExport, setShowExport] = useState(false);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));


    const calculate = (e) => {


        e.preventDefault();
        setSaved(false);

        const gross = +form.grossIncome || 0;
        const exp = +form.businessExpenses || 0;
        const ret = +form.retirement || 0;
        const health = +form.health || 0;
        const homeOffice = +form.homeOffice || 0;
        const netProfit = Math.max(gross - exp, 0);

        // 🇮🇳 INDIA TAX SYSTEM
        if (form.country === "India") {

            const taxable = Math.max(netProfit - ret - health - homeOffice, 0);
            const total = calculateIndianTax(taxable);
            const quarterly = total / 4;
            const effRate = gross > 0 ? (total / gross) * 100 : 0;

            setResult({
                gross,
                exp,
                netProfit,
                seTax: 0,
                fedTax: total,
                stateTax: 0,
                total,
                quarterly,
                effRate,
                taxable,
                country: "India"
            });

            return;
        }

        // 🇺🇸 US TAX SYSTEM

        const seTax = netProfit * 0.9235 * 0.153;

        const agi = netProfit - seTax / 2 - ret - health;

        const stdDeduction =
            form.filingStatus === 'Married Filing Jointly'
                ? 27700
                : 13850;

        const taxable = Math.max(agi - stdDeduction, 0);

        const fedTax = calcFederal(taxable);

        const stateRate = STATE_RATES[form.state] ?? 0.05;

        const stateTax = taxable * stateRate;

        const total = fedTax + stateTax + seTax;

        const quarterly = total / 4;

        const effRate = gross > 0 ? (total / gross) * 100 : 0;

        setResult({
            gross,
            exp,
            netProfit,
            seTax,
            fedTax,
            stateTax,
            total,
            quarterly,
            effRate,
            taxable,
            country: "US"
        });

    };


    const deadlines = [
        { id: 1, title: 'Q1 Payment', date: 'Apr 15, 2025', status: 'Paid', type: 'neutral' },
        { id: 2, title: 'Q2 Payment', date: 'Jun 16, 2025', status: 'Upcoming', type: 'income' },
        { id: 3, title: 'Q3 Payment', date: 'Sep 15, 2025', status: 'Upcoming', type: 'income' },
        { id: 4, title: 'Q4 Payment', date: 'Jan 15, 2026', status: 'Draft', type: 'warning' },
    ];


    const US_STATES = [
    'California',
    'New York',
    'Texas',
    'Florida',
    'Washington',
    'Illinois'
    ];

    const INDIA_STATES = [
    'West Bengal',
    'Maharashtra',
    'Karnataka',
    'Delhi',
    'Tamil Nadu',
    'Gujarat',
    'Uttar Pradesh',
    'Rajasthan',
    'Kerala',
    'Punjab'
        ];
    const exportCSV = (result, form) => {

        if (!result) return;

    const rows = [
        ["Country", form.country],
        ["State", form.state],
        ["Quarter", form.quarter],
        ["Gross Income", result.gross],
        ["Net Profit", result.netProfit],
        ["Taxable Income", result.taxable],
        ["Total Tax", result.total],
        ["Quarterly Payment", result.quarterly],
        ["Effective Rate", result.effRate + "%"]
        ];

    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach(r => {
        csvContent += r.join(",") + "\n";
        });

    const encoded = encodeURI(csvContent);

    const link = document.createElement("a");

    link.setAttribute("href", encoded);
    link.setAttribute("download", "tax_estimate.csv");

    document.body.appendChild(link);
    link.click();
        };



    const exportPDF = (result, form) => {

    if (!result) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Tax Estimation Report", 20, 20);

    doc.setFontSize(12);

    const lines = [
        `Country: ${form.country}`,
        `State: ${form.state}`,
        `Quarter: ${form.quarter}`,
        `Gross Income: ${result.gross}`,
        `Net Profit: ${result.netProfit}`,
        `Taxable Income: ${result.taxable}`,
        `Total Tax: ${result.total}`,
        `Quarterly Payment: ${result.quarterly}`,
        `Effective Rate: ${result.effRate.toFixed(1)}%`
         ];

         lines.forEach((line, i) => {
            doc.text(line, 20, 40 + i * 10);
        });

     doc.save("tax_estimate.pdf");

    };




    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-[28px] font-black tracking-tight text-slate-900 mb-1">Tax Estimator</h1>
                <p className="label">Estimate your quarterly self-employment tax obligations</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start mb-8">
                {/* Form */}
                <div className="xl:col-span-2 card p-8">
                    <h3 className="text-[17px] font-black text-slate-900 mb-7 italic">Quarterly Tax Calculator</h3>
                    <form onSubmit={calculate} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Sel label="Country/Region" opts={['United States', 'India', 'Canada', 'United Kingdom']} val={form.country} set={v => set('country', v)} />
                            <Sel
                            label="State/Province"
                             opts={form.country === "India" ? INDIA_STATES : US_STATES}
                             val={form.state}
                            set={v => set('state', v)}
                            />
                            <Sel label="Filing Status" opts={['Single', 'Married Filing Jointly', 'Head of Household']} val={form.filingStatus} set={v => set('filingStatus', v)} />
                            <Sel label="Quarter" opts={['Q1 (Jan-Mar 2025)', 'Q2 (Apr-Jun 2025)', 'Q3 (Jul-Sep 2025)', 'Q4 (Oct-Dec 2025)']} val={form.quarter} set={v => set('quarter', v)} />
                        </div>

                        <SectionDivider label="Income" />
                        <Num label="Gross Income for Quarter" hint="Total revenue before deductions" val={form.grossIncome} set={v => set('grossIncome', v)} />

                        <SectionDivider label="Deductions" />
                        <div className="grid grid-cols-2 gap-4">
                            <Num label="Business Expenses" hint="Software, travel, office" val={form.businessExpenses} set={v => set('businessExpenses', v)} />
                            <Num label="Retirement Contributions" hint="SEP-IRA, Solo 401k" val={form.retirement} set={v => set('retirement', v)} />
                            <Num label="Health Insurance Premiums" hint="Self-employed health" val={form.health} set={v => set('health', v)} />
                            <Num label="Home Office Deduction" hint="Dedicated workspace" val={form.homeOffice} set={v => set('homeOffice', v)} />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button type="submit" className="btn-primary px-10 py-4 rounded-xl">
                                <Calculator size={16} /> Calculate Estimate
                            </button>
                        </div>
                    </form>
                </div>

                {/* Result panel */}
                <div className="card p-7 min-h-96 flex flex-col">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-[16px] font-black text-slate-900 italic">Tax Summary</h3>
                                    <span className="badge badge-neutral">{form.quarter}</span>
                                </div>

                                {/* Main figure */}
                                <div className="rounded-2xl p-6 mb-6 text-center" style={{ background: '#0F172A' }}>
                                    <p className="label mb-2" style={{ color: '#64748B' }}>Quarterly Payment Due</p>
                                    <p className="text-[36px] font-black tracking-tight text-white">{fmt(result.quarterly, 2, form.country)}</p>
                                </div>

                                <div className="space-y-2.5 flex-1">
                                    <TaxLine label="Gross Income" val={fmt(result.gross, 0, form.country)} />
                                    <TaxLine label="Net Profit" val={fmt(result.netProfit, 0, form.country)} />
                                    <TaxLine label="Taxable Income" val={fmt(result.taxable, 0, form.country)} />
                                    <div className="h-px my-3" style={{ background: '#F1F5F9' }} />
                                    <TaxLine label="SE Tax (15.3%)" val={fmt(result.seTax, 2, form.country)} red />
                                    <TaxLine label="Federal Income Tax" val={fmt(result.fedTax, 2, form.country)} red />
                                    <TaxLine label={`${form.state.split(' ')[0]} State Tax`} val={fmt(result.stateTax, 2, form.country)} red />
                                    <div className="h-px my-3" style={{ background: '#F1F5F9' }} />
                                    <TaxLine label="Annual Total" val={fmt(result.total, 2, form.country)} bold />
                                    <TaxLine label="Effective Rate" val={`${result.effRate.toFixed(1)}%`} bold />
                                </div>

                                <button
                                    onClick={() => {
                                        addTaxCalculation({
                                            quarter: form.quarter,
                                            state: form.state,
                                            quarterlyPayment: result.quarterly,
                                            effectiveRate: result.effRate
                                            });
                                        setSaved(true);
                                        }}
                                     disabled={saved}
                                     className="mt-6 w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                     style={{
                                        background: saved ? 'var(--income-light)' : 'var(--income)',
                                        color: saved ? 'var(--income)' : 'white',
                                        border: saved ? '1px solid #A7F3D0' : 'none',
                                        boxShadow: saved ? 'none' : '0 2px 12px rgba(16,185,129,0.3)'
                                        }}
                                   >
                                    <ShieldCheck size={16} />
                                    {saved ? 'Saved!' : 'Save Calculation'}
                                </button>


                                {/* Export Dropdown */}
                                <div className="relative mt-3">
                                <button
                                onClick={() => setShowExport(!showExport)}
                                className="btn-secondary w-full flex items-center justify-center gap-2"
                                >
                                <Download size={14} />
                                    Export
                                </button>

                                {showExport && (
                                    <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10">
                                    <button
                                    onClick={() => {
                                    exportPDF(result, form);
                                    setShowExport(false);
                                    }}
                                 className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                                    >
                                Export as PDF
                                </button>

                        <button
                            onClick={() => {
                                exportCSV(result, form);
                                setShowExport(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                            >
                            Export as CSV
                        </button>

                    </div>
                    )}

                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center flex-1 text-center py-12">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#F1F5F9', color: '#CBD5E1' }}>
                                    <FileText size={32} />
                                </div>
                                <h4 className="text-[15px] font-black text-slate-900 mb-2 italic">Tax Summary</h4>
                                <p className="text-[12px] font-semibold text-slate-400 max-w-[180px] leading-relaxed">Fill in your income details on the left, then hit Calculate.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Saved history */}
            {taxCalculations.length > 0 && (
                <div className="card overflow-hidden mb-8">
                    <div className="px-7 py-5" style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <h3 className="text-[17px] font-black text-slate-900 italic">Saved Calculations</h3>
                        <p className="label mt-0.5">Your quarterly tax history</p>
                    </div>
                    <table className="w-full data-table">
                        <thead><tr>
                            <th className="text-left">Quarter</th>
                            <th className="text-left">State</th>
                            <th className="text-right">Quarterly Due</th>
                            <th className="text-right">Eff. Rate</th>
                            <th className="text-right">Saved</th>
                        </tr></thead>
                        <tbody>
                            {taxCalculations.map(c => (
                                <tr key={c.id}>
                                    <td className="font-bold text-slate-900">{c.quarter}</td>
                                    <td><span className="badge badge-neutral">{c.state}</span></td>
                                    <td className="text-right"><span className="text-[14px] font-black" style={{ color: 'var(--income)' }}>{fmt(c.quarterlyPayment, 2)}</span></td>
                                    <td className="text-right font-bold text-slate-500">{c.effectiveRate.toFixed(1)}%</td>
                                    <td className="text-right text-slate-400 font-semibold text-[12px]">{c.savedAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Tax calendar */}
            <div className="card p-8">
                <div className="flex justify-between items-center mb-7">
                    <div>
                        <h3 className="text-[17px] font-black text-slate-900 italic">Tax Calendar</h3>
                        <p className="label mt-0.5">2025 Quarterly Deadlines</p>
                    </div>
                    <button className="btn-secondary"><Calendar size={14} /> Add to Calendar</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deadlines.map(d => (
                        <div key={d.id} className="flex items-center justify-between p-5 rounded-2xl transition-all"
                            style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.boxShadow = 'none'; }}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                                    <span className="text-[13px] font-black text-slate-900">{d.date.split(' ')[1].replace(',', '')}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{d.date.split(' ')[0]}</span>
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-slate-900">{d.title}</p>
                                    <p className="text-[11px] font-semibold text-slate-400">{d.date}</p>
                                </div>
                            </div>
                            <span className={`badge badge-${d.type}`}>{d.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

const SectionDivider = ({ label }) => (
    <div className="flex items-center gap-3">
        <span className="label">{label}</span>
        <div className="flex-1 h-px" style={{ background: '#F1F5F9' }} />
    </div>
);

const Sel = ({ label, opts, val, set }) => (
    <div>
        <label className="label mb-1.5 block">{label}</label>
        <select className="form-input" value={val} onChange={e => set(e.target.value)}>
            {opts.map(o => <option key={o}>{o}</option>)}
        </select>
    </div>
);

const Num = ({ label, hint, val, set }) => (
    <div>
        <label className="label mb-1 block">{label} {hint && <span className="normal-case tracking-normal font-medium text-slate-300 ml-1">{hint}</span>}</label>
        <input type="number" className="form-input" placeholder="0.00" value={val} onChange={e => set(e.target.value)} />
    </div>
);

const TaxLine = ({ label, val, red, bold }) => (
    <div className={`flex justify-between items-center ${bold ? 'p-3 rounded-xl' : ''}`}
        style={bold ? { background: '#F8FAFC', border: '1px solid #F1F5F9' } : {}}>
        <span className={`text-[12px] font-${bold ? 'black' : 'semibold'} ${bold ? 'text-slate-700' : 'text-slate-400'} uppercase tracking-tight`}>{label}</span>
        <span className={`text-[13px] font-black ${red ? 'text-rose-500' : bold ? 'text-slate-900' : 'text-slate-600'}`}>{val}</span>
    </div>
);
