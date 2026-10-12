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
        violet: {
          brand: '#7C3AED',
        },
        lime: {
          brand: '#A3E635',
        },
        coral: {
          brand: '#FB7185',
        },
        cyan: {
          brand: '#22D3EE',
        },
        navy: {
          950: '#060A14',
          900: '#0B1020',
          800: '#131B33',
          700: '#1E294B',
          600: '#334155'
        }
      },
      fontFamily: {
        heading: ['Lalezar', 'system-ui', 'sans-serif'],
        body: ['Tajawal', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '24': '24px',
        '32': '32px',
      }
    },
  },
  plugins: [],
};
