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
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: '#DD388B',
        accent: '#F5DEEA',
        'dark-bg': '#0D1533',
      },
    },
  },
  plugins: [],
}
