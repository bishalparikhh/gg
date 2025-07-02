/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',    // for Next.js 13+ app directory
    './pages/**/*.{js,ts,jsx,tsx}',  // for the pages directory if you're using it
    './components/**/*.{js,ts,jsx,tsx}', // if you're using a components directory
  ],
  theme: {
    extend: {},
  },
   plugins: [require('daisyui')],
  daisyui: {
    themes: ["light"], // Or ["light", "dark"] for toggle support
  },
}
