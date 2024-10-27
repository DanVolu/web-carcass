/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "coffee-400": "#291E1E",
        "coffee-300": "#5C4342",
        "coffee-200": "#F2CEA9",
        "coffee-100": "#EFD8BF",
      },
    },
  },
  plugins: [],
}

