/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: "#00e6ff",
        neonGreen: "#00ff87",
        neonPurple: "#a100ff",
        cyberBg: "#0a0a0a",
      },
    },
  },
  plugins: [],
};
