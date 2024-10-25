/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom color here
        lightGreen: '#6E8A61', 
        darkGreen : '#20350C',
        customGrey : '#E4E0E1',
        customWhite : '#F5F7F8',
        customGreen : '#16423C',
        darkGrey : '#F6F5F5'
      },
    },
  },
  plugins: [],
}

