/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      colors: {
        dark: "#1e1e1e",
        light: "#f7f7f7",
        purple: "#6b21a8",
      },
      animation: {
        fadeInUp: "fadeInUp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
  darkMode: ["class", '[data-theme="dark"]'],
  lightMode: ["class", '[data-theme="light"]'],
};
