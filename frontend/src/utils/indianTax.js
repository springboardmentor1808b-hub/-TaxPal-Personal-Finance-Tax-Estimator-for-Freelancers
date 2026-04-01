// India New Tax Regime FY 2025-26

const INDIAN_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 0.05 },
  { min: 600000, max: 900000, rate: 0.10 },
  { min: 900000, max: 1200000, rate: 0.15 },
  { min: 1200000, max: 1500000, rate: 0.20 },
  { min: 1500000, max: Infinity, rate: 0.30 }
];

export function calculateIndianTax(income) {

  let tax = 0;

  for (const slab of INDIAN_SLABS) {

    if (income > slab.min) {

      const taxableAmount = Math.min(income, slab.max) - slab.min;

      if (taxableAmount > 0) {
        tax += taxableAmount * slab.rate;
      }

    }

  }

  // Section 87A rebate
  if (income <= 1200000) {
    return 0;
  }

  // Health & Education Cess (4%)
  tax = tax * 1.04;

  return Math.round(tax);

}