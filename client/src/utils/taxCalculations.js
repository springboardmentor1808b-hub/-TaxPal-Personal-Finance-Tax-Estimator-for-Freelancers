export const calculateTaxByRegion = (income, region) => {
  if (income <= 0) return 0;

  if (region === "India (New)") {
    let tax = 0;
    if (income <= 300000) tax = 0;
    else if (income <= 700000) tax = (income - 300000) * 0.05;
    else if (income <= 1000000) tax = 20000 + (income - 700000) * 0.10;
    else if (income <= 1200000) tax = 50000 + (income - 1000000) * 0.15;
    else if (income <= 1500000) tax = 80000 + (income - 1200000) * 0.20;
    else tax = 140000 + (income - 1500000) * 0.30;

    if (income <= 700000) return 0;

    const cess = tax * 0.04;
    return tax + cess;
  }

  if (region === "USA (Flat)") return income * 0.15;
  return 0;
};