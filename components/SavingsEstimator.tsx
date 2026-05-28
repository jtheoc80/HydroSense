"use client";

import { useState } from "react";
import { calculateSavings } from "@/lib/savings";
import { Button } from "@/components/catalyst/button";

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

  const { annual, fiveYear, tenYear, paybackMonths } = calculateSavings(
    premium,
    discount
  );

  return (
    <section id="savings-estimator" className="py-20 lg:py-28 bg-ink-950/50">
      <div className="section-container">
        <div className="max-w-3xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
            Savings calculator
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-fog-50 mb-5">
            Your savings, calculated
          </h2>
          <p className="text-fog-300 text-lg leading-relaxed">
            Adjust the inputs to match your policy. These are illustrative
            estimates based on published carrier discount tiers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Controls side */}
          <div className="space-y-10">
            {/* Premium slider */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <label className="text-sm text-fog-300 font-medium">
                  Annual premium
                </label>
                <span className="font-mono text-2xl text-signal-400 tracking-tight">
                  ${premium.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={2000}
                max={10000}
                step={100}
                value={premium}
                onChange={(e) => setPremium(Number(e.target.value))}
                className="w-full h-2 bg-ink-700 rounded-full appearance-none cursor-pointer accent-hydro-400 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-hydro-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-hydro-400/30"
                aria-label="Annual premium amount"
              />
              <div className="flex justify-between text-xs text-fog-400 mt-2 font-mono">
                <span>$2,000</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Discount tier */}
            <fieldset>
              <legend className="text-sm text-fog-300 font-medium mb-4">
                Carrier discount tier
              </legend>
              <div className="grid grid-cols-4 gap-3">
                {discountTiers.map((tier) => (
                  <button
                    key={tier.value}
                    onClick={() => setDiscount(tier.value)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                      discount === tier.value
                        ? "bg-hydro-400 text-ink-950 shadow-lg shadow-hydro-400/20"
                        : "bg-ink-800/60 border border-ink-700/40 text-fog-300 hover:bg-ink-800 hover:border-ink-700"
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
              <legend className="text-sm text-fog-300 font-medium mb-4">
                Home age
              </legend>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {homeAges.map((age) => (
                  <button
                    key={age.value}
                    onClick={() => setHomeAge(age.value)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                      homeAge === age.value
                        ? "bg-hydro-400 text-ink-950 shadow-lg shadow-hydro-400/20"
                        : "bg-ink-800/60 border border-ink-700/40 text-fog-300 hover:bg-ink-800 hover:border-ink-700"
                    }`}
                    aria-pressed={homeAge === age.value}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Results side */}
          <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-8 lg:p-10 flex flex-col justify-center backdrop-blur-sm">
            <div className="space-y-8">
              {/* Primary number */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-fog-400 mb-3">
                  Annual savings
                </p>
                <p className="font-mono text-5xl lg:text-6xl text-signal-400 tracking-tight leading-none">
                  ${annual.toLocaleString()}
                </p>
              </div>

              {/* Secondary numbers */}
              <div className="grid grid-cols-2 gap-6 border-t border-ink-700/50 pt-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-fog-400 mb-2">
                    5-year savings
                  </p>
                  <p className="font-mono text-2xl lg:text-3xl text-signal-400/80 tracking-tight">
                    ${fiveYear.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-fog-400 mb-2">
                    10-year savings
                  </p>
                  <p className="font-mono text-2xl lg:text-3xl text-signal-400/80 tracking-tight">
                    ${tenYear.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payback */}
              <div className="border-t border-ink-700/50 pt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-fog-400 mb-2">
                  Payback period
                </p>
                <p className="font-mono text-2xl lg:text-3xl text-hydro-400 tracking-tight">
                  {paybackMonths} months
                </p>
              </div>
            </div>

            <Button
              href="#lead-form"
              className="!mt-10 !w-full !rounded-xl !py-3.5 !text-base !font-semibold !bg-hydro-400 !text-ink-950 hover:!bg-hydro-300 !border-transparent !shadow-lg !shadow-hydro-400/25 [--btn-bg:var(--color-hydro-400)] [--btn-border:var(--color-hydro-400)] [--btn-hover-overlay:transparent] before:!bg-hydro-400 before:!shadow-none dark:!bg-hydro-400 dark:before:!hidden"
            >
              Lock in this savings. Get a quote.
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
