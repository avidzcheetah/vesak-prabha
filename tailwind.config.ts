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
        bg: {
          primary: "#0B0F2E",
          card: "#13183F",
          "card-hover": "#1A2050",
        },
        accent: {
          pink: "#F601A7",
          "pink-hover": "#D80090",
          gold: "#F59E0B",
          "gold-light": "#FCD34D",
          purple: "#AA00FF",
        },
        text: {
          primary: "#FFFBF0",
          muted: "#9CA3AF",
          "muted-dark": "#6B7280",
        },
        border: {
          DEFAULT: "#2D3B8E",
          light: "#3D4B9E",
        },
      },
      fontFamily: {
        sinhala: ["var(--font-noto-serif-sinhala)", "serif"],
        "sinhala-display": ["var(--font-maname)", "var(--font-noto-serif-sinhala)", "serif"],
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      animation: {
        "lantern-sway": "lanternSway 3s ease-in-out infinite",
        "float-up": "floatUp 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "particle-rise": "particleRise 8s ease-in-out infinite",
      },
      keyframes: {
        lanternSway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        floatUp: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(-100vh) rotate(360deg)", opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(246, 1, 167, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(246, 1, 167, 0.6)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        particleRise: {
          "0%": { transform: "translateY(100vh) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-10vh) scale(1)", opacity: "0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-fuchsia": "linear-gradient(135deg, #F601A7 0%, #AA00FF 100%)",
        "gradient-gold": "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)",
        "gradient-dark": "linear-gradient(180deg, #0B0F2E 0%, #13183F 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
