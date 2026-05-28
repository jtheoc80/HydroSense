"use client";

import { useEffect, useState } from "react";

function useCountUp(target: number, duration: number = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

export default function SavingsCounter() {
  const annual = useCountUp(487);
  const decade = useCountUp(5844);
  const percent = useCountUp(12);

  return (
    <div className="bg-ink-800 border border-ink-700 rounded-xl p-6 lg:p-8">
      <p className="text-xs uppercase tracking-widest text-fog-300 mb-6">
        Annual Savings Estimate
      </p>
      <div className="space-y-5">
        <div>
          <p className="font-mono text-4xl lg:text-5xl text-signal-400 tracking-tight">
            ${annual.toLocaleString()}{" "}
            <span className="text-lg text-fog-300">/ year</span>
          </p>
          <p className="text-sm text-fog-300 mt-1">
            Your estimated insurance credit
          </p>
        </div>
        <div className="border-t border-ink-700 pt-5">
          <p className="font-mono text-2xl lg:text-3xl text-signal-400 tracking-tight">
            ${decade.toLocaleString()}{" "}
            <span className="text-base text-fog-300">over 10 years</span>
          </p>
        </div>
        <div className="border-t border-ink-700 pt-5">
          <p className="font-mono text-2xl lg:text-3xl text-hydro-400 tracking-tight">
            +{percent}%{" "}
            <span className="text-base text-fog-300">
              saved on water-damage portion
            </span>
          </p>
        </div>
      </div>
      <a
        href="#savings-estimator"
        className="block text-center text-sm text-hydro-400 hover:text-hydro-300 mt-6 transition-colors"
      >
        Calculate your exact savings
      </a>
    </div>
  );
}
