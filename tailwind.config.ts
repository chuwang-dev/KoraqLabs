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
          DEFAULT: "#12151A",
          50: "#F4F5F6",
          100: "#E6E8EA",
          200: "#C7CBD0",
          300: "#9AA0A8",
          400: "#6B7178",
          500: "#4A4F56",
          600: "#33373D",
          700: "#22252A",
          800: "#181B1F",
          900: "#12151A",
          950: "#0B0D10",
        },
        paper: {
          DEFAULT: "#F9F4F9",
          soft: "#F3EEF3",
        },
        signal: {
          DEFAULT: "#C8A2C8",
          50: "#F9F2F9",
          100: "#F3E7F3",
          200: "#EAD7EA",
          300: "#D7BCD7",
          400: "#C8A2C8",
          500: "#C8A2C8",
          600: "#AF8AAF",
          700: "#8D6F8D",
          800: "#624E62",
          900: "#3A2D3A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
