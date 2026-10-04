/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base palette – charcoal/slate dark mode
        surface: {
          DEFAULT: "#0f1117",   // deepest bg
          1: "#161b26",          // card bg
          2: "#1e2535",          // elevated card
          3: "#252d40",          // input / hover surface
          border: "#2e3a52",    // dividers
        },
        // Neon accent: emerald green
        neon: {
          green: "#00e5a0",
          "green-dim": "#00c98a",
          "green-glow": "rgba(0,229,160,0.18)",
        },
        // Neon accent: electric blue
        electric: {
          blue: "#4d9fff",
          "blue-dim": "#3a8fee",
          "blue-glow": "rgba(77,159,255,0.18)",
        },
        // Status colors
        status: {
          success: "#00e5a0",
          warning: "#ffb347",
          error: "#ff5670",
          info: "#4d9fff",
        },
        // Text hierarchy
        text: {
          primary: "#f0f4ff",
          secondary: "#8899bb",
          muted: "#4a5578",
        },
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
        display: ["Inter", "Poppins", "sans-serif"],
      },
      boxShadow: {
        "neon-green": "0 0 20px rgba(0,229,160,0.35), 0 0 60px rgba(0,229,160,0.12)",
        "neon-blue":  "0 0 20px rgba(77,159,255,0.35), 0 0 60px rgba(77,159,255,0.12)",
        "card": "0 4px 24px rgba(0,0,0,0.45)",
        "panel": "0 -8px 40px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "slide-up": {
          "0%":   { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.5" },
        },
        "ping-slow": {
          "0%":    { transform: "scale(1)",   opacity: "0.8" },
          "100%":  { transform: "scale(2.2)", opacity: "0"   },
        },
        shimmer: {
          "0%":    { backgroundPosition: "-200% 0" },
          "100%":  { backgroundPosition:  "200% 0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up":    "slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-neon":  "pulse-neon 2s ease-in-out infinite",
        "ping-slow":   "ping-slow 1.8s ease-out infinite",
        shimmer:       "shimmer 1.6s linear infinite",
        "fade-in":     "fade-in 0.35s ease both",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
