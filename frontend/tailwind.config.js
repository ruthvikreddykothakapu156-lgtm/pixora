/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "var(--bg)",
          surface: "var(--bg-surface)",
        },
        border: {
          DEFAULT: "var(--border)",
        },
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "#7C3AED",
          light: "#A855F7",
          pink: "#EC4899",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #7C3AED, #A855F7)",
        "accent-gradient-3": "linear-gradient(135deg, #7C3AED, #A855F7, #EC4899)",
        "mesh-gradient": "radial-gradient(at 20% 20%, #7C3AED33 0px, transparent 50%), radial-gradient(at 80% 0%, #A855F733 0px, transparent 50%), radial-gradient(at 40% 80%, #EC489933 0px, transparent 50%)",
      },
      maxWidth: {
        "8xl": "1600px",
        "9xl": "1800px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease forwards",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};