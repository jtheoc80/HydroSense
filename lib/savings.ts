export function calculateSavings(premium: number, discountPercent: number) {
  const annual = Math.round(premium * (discountPercent / 100));
  const fiveYear = annual * 5;
  const tenYear = annual * 10;
  const installCost = 999;
  const paybackMonths =
    annual > 0 ? Math.ceil((installCost / annual) * 12) : 0;

  return { annual, fiveYear, tenYear, paybackMonths };
}

export function estimatedSavingsForCarrier(carrier: string): {
  low: number;
  high: number;
} {
  const tiers: Record<string, { low: number; high: number }> = {
    "State Farm": { low: 300, high: 500 },
    USAA: { low: 400, high: 600 },
    Allstate: { low: 350, high: 550 },
    Farmers: { low: 250, high: 450 },
    Travelers: { low: 300, high: 500 },
    "Liberty Mutual": { low: 250, high: 450 },
    Nationwide: { low: 250, high: 400 },
    Progressive: { low: 200, high: 400 },
    "Texas Farm Bureau": { low: 250, high: 450 },
    Chubb: { low: 500, high: 750 },
  };
  return tiers[carrier] || { low: 300, high: 600 };
}
