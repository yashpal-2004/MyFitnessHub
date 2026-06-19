/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        // Neumorphism outset (extruded)
        'neu-outset': '5px 5px 10px #cbd5e1, -5px -5px 10px #ffffff',
        'neu-outset-sm': '3px 3px 6px #cbd5e1, -3px -3px 6px #ffffff',
        // Neumorphism inset (pressed)
        'neu-inset': 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff',
        'neu-inset-sm': 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff',
        // Skeuomorphic tactile button
        'skeuo-button': '0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 0 rgba(0, 0, 0, 0.12)',
        'skeuo-button-active': 'inset 0 2px 4px rgba(0,0,0,0.15)',
        // Glassmorphism soft drop
        'glass': '0 8px 32px 0 rgba(148, 163, 184, 0.08)',
      }
    },
  },
  plugins: [],
}
