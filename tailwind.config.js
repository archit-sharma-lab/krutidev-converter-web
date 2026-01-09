/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        bgDark: "#0f0f14",
        cardDark: "#18181f",
        accent: "#d4af37"
      }
    }
  },
  plugins: []
};
