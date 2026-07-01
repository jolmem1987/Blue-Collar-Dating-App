import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Stamped-steel identity
        ink: "#0C121C",        // deepest navy-charcoal (page base)
        steel: {
          950: "#0F1722",
          900: "#141D2A",      // primary surface
          800: "#1C2735",      // raised surface
          700: "#2A3849",      // borders / lines
          600: "#3C4D63",
          500: "#5C6E86",      // muted text
          400: "#8A9AB0",
        },
        bone: "#F4F6FA",        // white / primary text
        // Safety orange — the one bold action color
        orange: {
          DEFAULT: "#F2581B",
          600: "#D8470F",
          500: "#F2581B",
          400: "#FF7A3C",
        },
        // Muted yellow accent (hazard / verified)
        amber: {
          DEFAULT: "#E0A93B",
          600: "#C8902A",
          400: "#EDC264",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Saira Condensed", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        stamp: "0.14em",
      },
      backgroundImage: {
        // Disciplined hazard-stripe accent
        hazard:
          "repeating-linear-gradient(45deg, #F2581B 0 14px, #0C121C 14px 28px)",
      },
      boxShadow: {
        plate: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 30px -12px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        plate: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
