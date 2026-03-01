exports.calculateTax = async (req, res) => {
  try {
    const { income, expenses, retirement, insurance, homeOffice } = req.body;

    const totalIncome = Number(income) || 0;

    const totalDeductions =
      (Number(expenses) || 0) +
      (Number(retirement) || 0) +
      (Number(insurance) || 0) +
      (Number(homeOffice) || 0);

    const taxableIncome = Math.max(totalIncome - totalDeductions, 0);

    // Example logic (replace later with slab rules)
    const estimatedTax = taxableIncome * 0.1;

    res.json({
      success: true,
      totalIncome,
      deductions: totalDeductions,
      taxableIncome,
      estimatedTax,
    });

  } catch (error) {
    console.error("Tax calculation error:", error);
    res.status(500).json({ message: "Tax calculation failed" });
  }
};