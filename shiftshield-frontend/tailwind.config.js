/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Medical Blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e', // Deep Navy
          950: '#082f49',
        },
        'medical-teal': '#0d9488',
        'soft-gray': '#f8fafc',
        'risk': {
          low: '#10b981', // emerald-500
          medium: '#f59e0b', // amber-500
          high: '#f97316', // orange-500
          critical: '#ef4444' // red-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

