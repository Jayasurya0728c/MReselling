/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#15803d',
          600: '#0f6832',
          700: '#0b4d26',
          800: '#0a3f20',
          900: '#072e17',
          950: '#031b0c',
        },
        warm: {
          50: '#fbf9f5',
          100: '#f6f2e9',
          200: '#eee6d8',
          300: '#dfd4bf',
          400: '#c5b498',
          500: '#ab9573',
          800: '#4a3f31',
          900: '#2b241c',
        },
        accent: {
          DEFAULT: '#b45309',
          light: '#fef3c7',
          hover: '#92400e',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        'float': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
