"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceDot,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Premium index data                                                 */
/* ------------------------------------------------------------------ */

const premiumData = [
  { year: "2021", index: 100 },
  { year: "2022", index: 116 },
  { year: "2023", index: 147 },
  { year: "2024", index: 152 },
  { year: "2025", index: 158 },
];

/* ------------------------------------------------------------------ */
/*  Claims counter logic                                               */
/* ------------------------------------------------------------------ */

const DAILY_CLAIMS = 60;

function getClaimsToday(): number {
  const now = new Date();
  const ctNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
  const midnight = new Date(ctNow);
  midnight.setHours(0, 0, 0, 0);
  const fractionOfDay =
    (ctNow.getTime() - midnight.getTime()) / 86_400_000;
  return Math.floor(fractionOfDay * DAILY_CLAIMS);
}

/* ------------------------------------------------------------------ */
/*  Annotation label component                                         */
/* ------------------------------------------------------------------ */

function AnnotationLabel({
  viewBox,
}: {
  viewBox?: { x?: number; y?: number };
}) {
  if (!viewBox?.x || !viewBox?.y) return null;
  return (
    <text
      x={viewBox.x}
      y={viewBox.y - 14}
      textAnchor="middle"
      className="fill-signal-400 text-[11px] font-mono font-semibold"
    >
      +46% in two years
    </text>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated claims number                                             */
/* ------------------------------------------------------------------ */

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;

    const duration = 800;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(start + diff * eased));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{display}</>;
}

/* ------------------------------------------------------------------ */
/*  Main panel                                                         */
/* ------------------------------------------------------------------ */

export default function CriticalDataPanel() {
  const [claims, setClaims] = useState<number | null>(null);

  const updateClaims = useCallback(() => {
    setClaims(getClaimsToday());
  }, []);

  useEffect(() => {
    updateClaims();
    const interval = setInterval(updateClaims, 60_000);
    return () => clearInterval(interval);
  }, [updateClaims]);

  return (
    <div className="rounded-2xl bg-ink-900 border border-ink-700/30 overflow-hidden">
      {/* Hydro accent line */}
      <div className="h-px bg-hydro-400" />

      <div className="p-6 lg:p-8 space-y-8">
        {/* Element 1: Premium chart */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-fog-300 font-medium mb-4">
            Texas homeowners premium, indexed
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={premiumData}
                margin={{ top: 20, right: 12, bottom: 0, left: 12 }}
              >
                <defs>
                  <linearGradient
                    id="hydroFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#38BDF8"
                      stopOpacity={0.12}
                    />
                    <stop
                      offset="100%"
                      stopColor="#38BDF8"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#9AA8BF",
                    fontSize: 11,
                    fontFamily: "var(--font-geist-mono)",
                  }}
                  dy={8}
                />
                <YAxis hide domain={[90, 170]} />

                {/* Faint baseline at 100 */}
                <Area
                  type="monotone"
                  dataKey={() => 100}
                  stroke="#334155"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  fill="none"
                  isAnimationActive={false}
                />

                <Area
                  type="monotone"
                  dataKey="index"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  fill="url(#hydroFill)"
                  dot={false}
                  animationDuration={1200}
                />

                <ReferenceDot
                  x="2023"
                  y={147}
                  r={5}
                  fill="#C9A84C"
                  stroke="none"
                  label={<AnnotationLabel />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-[10px] text-fog-400 leading-relaxed">
            Indexed from Policygenius pricing analysis, 2021 to 2023.
            2024 to 2025 extrapolated from TDI rate filings. Illustrative.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-ink-700/40" />

        {/* Element 2: Claims counter */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-fog-300 font-medium mb-4">
            Water damage claims filed in the Houston metro today
          </p>
          <p className="font-mono text-5xl font-bold text-signal-400 tabular-nums">
            {claims !== null ? <AnimatedNumber value={claims} /> : "--"}
          </p>
          <p className="mt-4 text-sm text-fog-300 leading-relaxed">
            An estimated 60 water damage claims are filed across the
            Houston area every day. Your homeowners policy covers these.
            Flood is separate and excluded.
          </p>
          <p className="mt-3 text-[10px] text-fog-400 leading-relaxed">
            Modeled from Insurance Information Institute 1-in-67 annual
            water damage claim rate across approximately 1.5 million
            Houston-area owner-occupied homes. Illustrative estimate.
          </p>
        </div>
      </div>
    </div>
  );
}
