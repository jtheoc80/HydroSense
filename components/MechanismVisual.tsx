"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Compact animated SVG showing the smart water shutoff mechanism:
 * water flows → sensor detects anomaly → valve closes → home protected.
 * Used as the lead visual on device pages.
 */
export default function MechanismVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-xl bg-ink-800/40 border border-ink-700/30 p-6 lg:p-8 overflow-hidden"
    >
      <svg
        viewBox="0 0 600 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-label="Smart water shutoff mechanism: water flows through the main line, sensor detects a leak, valve closes automatically"
        role="img"
      >
        {/* Main water pipe */}
        <rect
          x="40"
          y="60"
          width="520"
          height="40"
          rx="6"
          className="fill-ink-900 stroke-ink-700"
          strokeWidth="1.5"
        />

        {/* Water flow particles (animate when visible) */}
        {active && (
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                r="4"
                className="fill-hydro-400"
                opacity="0.7"
              >
                <animate
                  attributeName="cx"
                  from="60"
                  to="300"
                  dur="2.5s"
                  begin={`${i * 0.5}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="75;85;75;85;75"
                  dur="2.5s"
                  begin={`${i * 0.5}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.7;0.7;0.7;0"
                  dur="2.5s"
                  begin={`${i * 0.5}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}

        {/* Sensor node */}
        <g>
          <circle
            cx="220"
            cy="50"
            r="18"
            className={`transition-all duration-700 ${
              active
                ? "fill-hydro-400/20 stroke-hydro-400"
                : "fill-ink-900 stroke-ink-700"
            }`}
            strokeWidth="2"
          />
          {/* Sensor pulse rings */}
          {active && (
            <>
              <circle
                cx="220"
                cy="50"
                r="18"
                fill="none"
                className="stroke-hydro-400"
                strokeWidth="1.5"
              >
                <animate
                  attributeName="r"
                  from="18"
                  to="32"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.6"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx="220"
                cy="50"
                r="18"
                fill="none"
                className="stroke-hydro-400"
                strokeWidth="1.5"
              >
                <animate
                  attributeName="r"
                  from="18"
                  to="32"
                  dur="2s"
                  begin="1s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.6"
                  to="0"
                  dur="2s"
                  begin="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </>
          )}
          {/* Wifi/signal icon inside sensor */}
          <path
            d="M214 50a8.5 8.5 0 0 1 12 0"
            className="stroke-hydro-400"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M217 53a4.5 4.5 0 0 1 6 0"
            className="stroke-hydro-400"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="220" cy="56" r="1.5" className="fill-hydro-400" />
          {/* Connector line to pipe */}
          <line
            x1="220"
            y1="68"
            x2="220"
            y2="60"
            className="stroke-ink-700"
            strokeWidth="1.5"
          />
        </g>

        {/* Valve */}
        <g>
          {/* Valve body */}
          <rect
            x="350"
            y="55"
            width="50"
            height="50"
            rx="4"
            className={`transition-all duration-700 ${
              active
                ? "fill-signal-400/20 stroke-signal-400"
                : "fill-ink-900 stroke-ink-700"
            }`}
            strokeWidth="2"
          />
          {/* Valve handle */}
          <rect
            x="367"
            y="42"
            width="16"
            height="16"
            rx="3"
            className={`transition-all duration-700 ${
              active
                ? "fill-signal-400 stroke-signal-400"
                : "fill-ink-700 stroke-ink-700"
            }`}
            strokeWidth="1"
          />
          {/* Valve indicator line */}
          <line
            x1="375"
            y1="70"
            x2="375"
            y2="90"
            className={`transition-all duration-700 ${
              active ? "stroke-signal-400" : "stroke-ink-700"
            }`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* House icon (protected) */}
        <g>
          <path
            d="M500 45 L520 30 L540 45 L540 70 L500 70 Z"
            className={`transition-all duration-1000 ${
              active
                ? "fill-hydro-400/10 stroke-hydro-400"
                : "fill-ink-900 stroke-ink-700"
            }`}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Door */}
          <rect
            x="514"
            y="55"
            width="12"
            height="15"
            rx="1"
            className={`transition-all duration-1000 ${
              active ? "fill-hydro-400/20" : "fill-ink-800"
            }`}
          />
          {/* Shield check */}
          {active && (
            <g opacity="0">
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                dur="0.5s"
                begin="1.5s"
                fill="freeze"
              />
              <circle
                cx="520"
                cy="85"
                r="10"
                className="fill-hydro-400/20"
              />
              <path
                d="M515 85 L518 88 L525 81"
                className="stroke-hydro-400"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          )}
        </g>

        {/* Labels */}
        <text
          x="220"
          y="140"
          textAnchor="middle"
          className="fill-fog-300 text-[10px] font-mono"
        >
          SENSOR
        </text>
        <text
          x="375"
          y="140"
          textAnchor="middle"
          className="fill-fog-300 text-[10px] font-mono"
        >
          VALVE
        </text>
        <text
          x="520"
          y="140"
          textAnchor="middle"
          className="fill-fog-300 text-[10px] font-mono"
        >
          PROTECTED
        </text>

        {/* Flow direction arrow */}
        <path
          d="M80 80 L100 80"
          className="stroke-hydro-400"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead)"
        />
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0 0 L8 3 L0 6" className="fill-hydro-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
