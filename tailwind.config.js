/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        garamond: ['"EB Garamond"', 'serif'], 
      },
      boxShadow: {
        'glow': '0 0 10px rgba(255, 255, 255, 0.6)', 
      },
      textShadow: {
        'glow': '0 0 10px rgba(255, 255, 255, 0.6)',
      }
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
}