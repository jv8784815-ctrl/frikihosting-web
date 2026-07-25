/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0D13",
        panel: "#11151F",
        elevated: "#171C29",
        border: "#232A3B",
        primary: {
          DEFAULT: "#7C5CFF",
          dim: "#5B3FD9",
          glow: "#A692FF",
        },
        signal: {
          online: "#33D6A6",
          warn: "#FFB020",
          danger: "#FF5470",
          idle: "#5B6478",
        },
        ink: {
          DEFAULT: "#E6E9F0",
          muted: "#8A93A6",
          faint: "#565F73",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(124, 92, 255, 0.25)",
        card: "0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "hex-grid":
          "radial-gradient(circle at 1px 1px, rgba(124,92,255,0.08) 1px, transparent 0)",
      },
      keyframes: {
        "pulse-node": {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.55, transform: "scale(0.9)" },
        },
        rise: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-node": "pulse-node 2.2s ease-in-out infinite",
        rise: "rise 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
