import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f6ff",
          100: "#e0ecfe",
          200: "#bae0fd",
          300: "#7cc5fb",
          400: "#38bdf8",
          500: "#0284c7",
          600: "#0369a1",
          700: "#075985",
          800: "#0c4a6e",
          900: "#082f49",
          950: "#031926",
        },
        automotive: {
          base: "#06080d",
          surface: "#0b0f17",
          raised: "#111622",
          card: "#151b2a",
          border: "#1e2638",
          borderLight: "#2a354d",
          chrome: "#94a3b8",
          silver: "#e2e8f0",
          gold: "#d4af37",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Cabinet Grotesk", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
