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
        'eksi-yesili':'#626a12',
        'reddit-grisi':'#e8dfd6',
        'reddit-fontcolor':'#2a210c',
        '526421':'#526421',
        'b5c276':'#b5c276',
        'cinnemon':'#7b3f00',
        'koyu-reddit-grisi':'#b0a8a0',
      },
      height: {
        custom_for_scrollbar:'480px',
        px107_for_logo:'107px',
      },
      width: {
        px310_for_logo:'310px',
      },
    },
  plugins: [],
  }

}