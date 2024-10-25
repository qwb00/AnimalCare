/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], // Добавляем шрифт Roboto
      },
      colors: {
        'main-blue': '#4BD4FF',
        'light-blue': '#CBF2FF',
      },
    },
  },
  plugins: [],
}
