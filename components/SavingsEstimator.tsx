"use client";

import { useState } from "react";

const discountTiers = [
  { label: "4%", value: 4 },
  { label: "7%", value: 7 },
  { label: "10%", value: 10 },
  { label: "14%", value: 14 },
];

const homeAges = [
  { label: "Under 10 yrs", value: "under-10" },
  { label: "10-30 yrs", value: "10-30" },
  { label: "30-50 yrs", value: "30-50" },
  { label: "Over 50 yrs", value: "over-50" },
];

export default function SavingsEstimator() {
  const [premium, setPremium] = useState(5000);
  const [discount, setDiscount] = useState(10);
  const [homeAge, setHomeAge] = useState("10-30");

  const annual = Math.round(premium * (discount / 100));
  const fiveYear = annual * 5;
  const tenYear = annual * 10;
  const installCost = 999;
  const paybackMonths = annual > 0 ? Math.ceil((installCost / annual) * 12) : 0;

  return (
    <section id="savings-estimator" className="py-20 lg:py-28 bg-ink-950/50">
      <div className="section-container">
        <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-4">
          Your savings, calculated
        </h2>
        <p className="text-fog-300 mb-12 max-w-2xl">
          Adjust the sliders to match your policy. These are illustrative estimates based on
          published carrier discount tiers.
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Inputs */}
          <div className="space-y-8">
            {/* Premium slider */}
            <div>
              <label className="block text-sm text-fog-300 mb-3">
                Annual premium:{" "}
                <span className="font-mono text-signal-300">${premium.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={2000}
                max={10000}
                step={100}
                value={premium}
                onChange={(e) => setPremium(Number(e.target.value))}
                className="w-full accent-hydro-400 h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer"
                aria-label="Annual premium amount"
              />
              <div className="flex justify-between text-xs text-fog-300 mt-1">
                <span>$2,000</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Discount tier */}
            <fieldset>
              <legend className="block text-sm text-fog-300 mb-3">Carrier discount tier</legend>
              <div className="grid grid-cols-4 gap-2">
                {discountTiers.map((tier) => (
                  <button
                    key={tier.value}
                    onClick={() => setDiscount(tier.value)}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      discount === tier.value
                        ? "bg-hydro-400 text-ink-950"
                        : "bg-ink-800 text-fog-300 hover:bg-ink-700"
                    }`}
                    aria-pressed={discount === tier.value}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Home age */}
            <fieldset>
              <legend className="block text-sm text-fog-300 mb-3">Home age</legend>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {homeAges.map((age) => (
                  <button
                    key={age.value}
                    onClick={() => setHomeAge(age.value)}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      homeAge === age.value
                        ? "bg-hydro-400 text-ink-950"
                        : "bg-ink-800 text-fog-300 hover:bg-ink-700"
                    }`}
                    aria-pressed={homeAge === age.value}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Output */}
          <div className="bg-ink-800 border border-ink-700 rounded-xl p-6 lg:p-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-fog-300 mb-1">
                  Annual savings
                </p>
                <p className="font-mono text-4xl lg:text-5xl text-signal-300 tracking-tight">
                  ${annual.toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-ink-700 pt-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-fog-300 mb-1">
                    5-year savings
                  </p>
                  <p className="font-mono text-2xl text-signal-300">
                    ${fiveYear.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-fog-300 mb-1">
                    10-year savings
                  </p>
                  <p className="font-mono text-2xl text-signal-300">
                    ${tenYear.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="border-t border-ink-700 pt-6">
                <p className="text-xs uppercase tracking-widest text-fog-300 mb-1">
                  Payback period
                </p>
                <p className="font-mono text-2xl text-hydro-400">
                  {paybackMonths} months
                </p>
              </div>
            </div>
            <a
              href="#lead-form"
              className="btn-primary mt-8 text-center w-full"
            >
              Lock in this savings — get a quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
