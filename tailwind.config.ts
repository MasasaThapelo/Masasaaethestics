import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          DEFAULT: '#D4AF37',
          50: '#faf8f0',
          100: '#f5f0e1',
          200: '#ebe1c3',
          300: '#e1d2a5',
          400: '#d7c387',
          500: '#D4AF37', // Main gold color
          600: '#D4AF37', // Same as main
          700: '#b8942e', // Darker for hover
          800: '#9c7925', // Darker for footer
          900: '#805e1c',
        },
      },
    },
  },
  plugins: [],
};
export default config;

