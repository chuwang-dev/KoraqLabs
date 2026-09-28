import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Navy-black foundation, drawn from the logo's K stem (#001030)
        ink: {
          DEFAULT: "#070B1C",
          950: "#040612",
          900: "#070B1C",
          800: "#0D1229",
          700: "#161C38",
          600: "#232A4A",
          500: "#474E6B",
          400: "#6B7291",
          300: "#959BB4",
          200: "#C3C7D8",
          100: "#E2E4EE",
          50: "#F1F2F8",
        },
        // Lilac paper — the site background, never plain white
        paper: {
          DEFAULT: "#F6F3FC",
          soft: "#EFEAF9",
          dim: "#E5DEF4",
          white: "#FDFCFF",
        },
        // Primary accent: the logo's violet wing
        signal: {
          DEFAULT: "#5B22D6",
          50: "#F1EAFD",
          100: "#DFCEFA",
          200: "#C2A3F5",
          300: "#A278EE",
          400: "#7C47E4",
          500: "#5B22D6",
          600: "#4718AE",
          700: "#361287",
          800: "#250C5E",
          900: "#17073B",
        },
        // Secondary accent: the logo's blue/cyan wing
        azure: {
          DEFAULT: "#0060F0",
          300: "#5FA9FF",
          400: "#2585FF",
          500: "#0060F0",
          600: "#0049C4",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "brand-wing": "linear-gradient(115deg, #0060F0 0%, #5B22D6 100%)",
      },
      maxWidth: { content: "1240px" },
      borderRadius: { sm: "4px", DEFAULT: "6px", md: "10px", lg: "14px" },
      transitionTimingFunction: { smooth: "cubic-bezier(0.16, 1, 0.3, 1)" },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.06", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
      },
    },
  },
  plugins: [],
};

export default config;
