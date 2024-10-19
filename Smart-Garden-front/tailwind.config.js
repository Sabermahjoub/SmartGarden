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
        darkGreen : '#20350C'
      },
    },
  },
  plugins: [],
}

