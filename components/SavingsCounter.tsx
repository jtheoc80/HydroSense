"use client";

import { useEffect, useState, useRef } from "react";

function useCountUp(target: number, duration: number = 1800) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);

  return { value, ref };
}

export default function SavingsCounter() {
  const annual = useCountUp(487);
  const decade = useCountUp(5844);
  const percent = useCountUp(12);

  return (
    <div
      ref={annual.ref}
      className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-8 lg:p-10 backdrop-blur-sm"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-fog-400 font-medium mb-8">
        Annual savings estimate
      </p>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-5xl lg:text-6xl text-signal-400 tracking-tight leading-none">
            ${annual.value.toLocaleString()}
            <span className="text-lg lg:text-xl text-fog-300 font-sans ml-2">
              / year
            </span>
          </p>
          <p className="text-sm text-fog-300 mt-3">
            Your estimated insurance credit
          </p>
        </div>
        <div className="border-t border-ink-700/50 pt-6">
          <p className="font-mono text-3xl lg:text-4xl text-signal-400/80 tracking-tight leading-none">
            ${decade.value.toLocaleString()}
            <span className="text-base text-fog-300 font-sans ml-2">
              over 10 years
            </span>
          </p>
        </div>
        <div className="border-t border-ink-700/50 pt-6">
          <p className="font-mono text-3xl lg:text-4xl text-hydro-400 tracking-tight leading-none">
            +{percent.value}%
            <span className="text-base text-fog-300 font-sans ml-2">
              saved on water-damage portion
            </span>
          </p>
        </div>
      </div>
      <a
        href="#savings-estimator"
        className="block text-center text-sm text-hydro-400 hover:text-hydro-300 mt-8 transition-colors font-medium"
      >
        Calculate your exact savings
      </a>
    </div>
  );
}
