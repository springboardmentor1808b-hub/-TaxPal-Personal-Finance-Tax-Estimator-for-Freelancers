import React, { useState, useMemo } from "react";
import { calculateTaxByRegion } from "../utils/taxCalculations";
import { formatCurrency } from "../utils/financeHelpers";

const TaxEstimator = ({ transactions = [], loading }) => {
  const [region, setRegion] = useState("India (New)");

  const taxData = useMemo(() => {
    const stats = (transactions || []).reduce((acc, curr) => {
      if (curr.type === 'income') acc.income += curr.amount;
      if (curr.type === 'expense') acc.expense += curr.amount;
      return acc;
    }, { income: 0, expense: 0 });

    const taxableIncome = Math.max(0, stats.income - stats.expense);
    const taxDue = calculateTaxByRegion(taxableIncome, region);
    
    return {
      taxableIncome,
      taxDue,
      netSavings: stats.income - stats.expense - taxDue,
      effectiveRate: taxableIncome > 0 ? ((taxDue / taxableIncome) * 100).toFixed(1) : 0
    };
  }, [transactions, region]);

  if (loading) return <div className="h-48 bg-gray-50 animate-pulse rounded-[2rem]" />;

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Tax View</h4>
        <select 
          className="text-[10px] font-black bg-gray-50 border-none rounded-lg px-2 py-1 outline-none"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="India (New)">🇮🇳 INR</option>
          <option value="USA (Flat)">🇺🇸 USD</option>
        </select>
      </div>

      {/* Main Stats - Now Compact and Dynamic */}
      <div className="grid grid-cols-1 gap-2">
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center">
          <span className="text-[10px] font-black text-gray-400 uppercase">Profit</span>
          <span className="font-black text-gray-900">{formatCurrency(taxData.taxableIncome, region)}</span>
        </div>

        <div className={`p-4 rounded-2xl border flex justify-between items-center transition-colors ${
          taxData.taxDue > 0 ? 'bg-orange-50 border-orange-100' : 'bg-emerald-50 border-emerald-100'
        }`}>
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase">Est. Tax</p>
            <h3 className={`text-lg font-black ${taxData.taxDue > 0 ? 'text-orange-700' : 'text-emerald-700'}`}>
              {formatCurrency(taxData.taxDue, region)}
            </h3>
          </div>
          {taxData.taxDue === 0 && <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">NIL</span>}
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex justify-between items-center">
          <span className="text-[10px] font-black text-blue-600 uppercase">In-Hand</span>
          <span className="font-black text-blue-900">{formatCurrency(taxData.netSavings, region)}</span>
        </div>
      </div>

      {/* Compact Info Footer */}
      <div className="text-[10px] text-gray-400 font-bold italic flex items-center gap-2">
        <span className="text-base">💡</span>
        Effective Rate: <span className="text-emerald-600">{taxData.effectiveRate}%</span>
      </div>
    </div>
  );
};

export default TaxEstimator;