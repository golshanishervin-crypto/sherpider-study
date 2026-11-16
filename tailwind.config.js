/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E53935', // قرمز اصلی
          50: '#FFEBEE',
          100: '#FFCDD2',
          500: '#E53935',
          600: '#D32F2F',
          700: '#C62828',
        },
        surface: {
          DEFAULT: '#FFFFFF', // سفید
          secondary: '#F5F5F5',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          secondary: '#6B6B6B',
        },
      },
      fontFamily: {
        fa: ['Vazirmatn', 'sans-serif'],
        en: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        input: '8px',
      },
    },
  },
  plugins: [],
}