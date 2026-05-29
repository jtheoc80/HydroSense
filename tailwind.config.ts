import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#00102D",
          900: "#001A4E",
          800: "#002469",
          700: "#1E3A8A",
        },
        hydro: {
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
        },
        signal: {
          400: "#C9A84C",
        },
        fog: {
          50: "#F8FAFC",
          100: "#E6EDF7",
          200: "#CBD5E1",
          300: "#9AA8BF",
          400: "#64748B",
        },
        alert: {
          500: "#EF4444",
        },
      },
      fontFamily: {
        display: ["var(--font-instrument-serif)", "serif"],
        serif: ["var(--font-serif)", "serif"],
        body: ["var(--font-geist-sans)", "sans-serif"],
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
