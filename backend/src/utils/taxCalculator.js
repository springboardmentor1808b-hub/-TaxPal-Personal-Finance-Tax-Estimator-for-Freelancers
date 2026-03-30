const calculateTax = (taxableIncome) => {
  let tax = 0;
  let remaining = taxableIncome;

  const slabs = [
    { limit: 250000, rate: 0 },
    { limit: 250000, rate: 0.05 },
    { limit: 500000, rate: 0.10 },
    { limit: 1000000, rate: 0.15 },
    { limit: Infinity, rate: 0.20 },
  ];

  for (let slab of slabs) {
    if (remaining <= 0) break;

    const taxableAmount = Math.min(remaining, slab.limit);
    tax += taxableAmount * slab.rate;
    remaining -= slab.limit;
  }

  return tax;
};

module.exports = calculateTax;