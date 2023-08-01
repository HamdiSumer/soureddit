/** @type {import('tailwindcss').Config} */

module.exports = {
  mode:'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#243c5a',
        'eksi-yesili':'#81c14b',
      },
      height: {
        custom_for_scrollbar:'480px'
      },
    },
  plugins: [],
  }

}