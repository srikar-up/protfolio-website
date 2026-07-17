/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#FF4500',  // Solar Orange
          green: '#10B981',   // Emerald Green
          lightBg: '#F5F5F7', // Off-white premium canvas
          darkBg: '#09090B',  // Absolute deep black canvas
          lightCard: '#FFFFFF',
          darkCard: '#121215',
        }
      },
      boxShadow: {
        'soft': '0 20px 50px -10px rgba(0, 0, 0, 0.02), 0 10px 20px -15px rgba(0, 0, 0, 0.03)',
        'soft-dark': '0 30px 100px -10px rgba(0, 0, 0, 0.5), 0 10px 30px -15px rgba(0, 0, 0, 0.4)',
        'book': '8px 12px 20px rgba(0, 0, 0, 0.12), -1px 0 4px rgba(0, 0, 0, 0.03)',
        'glow-orange': '0 0 40px rgba(255, 69, 0, 0.15)',
        'glow-green': '0 0 40px rgba(16, 185, 129, 0.15)'
      }
    },
  },
  plugins: [],
}
