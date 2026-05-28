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
          950: "#070C18",
          900: "#0B1220",
          800: "#0F1830",
          700: "#152043",
        },
        hydro: {
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
        },
        signal: {
          300: "#FCD34D",
          400: "#FBBF24",
        },
        fog: {
          50: "#F8FAFC",
          100: "#E6EDF7",
          200: "#CBD5E1",
          300: "#9AA8BF",
        },
        alert: {
          400: "#F87171",
          500: "#EF4444",
        },
      },
      fontFamily: {
        display: ["var(--font-instrument-serif)", "serif"],
        body: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
