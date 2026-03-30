/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: "#FF7043",      // deep orange (main buttons)
      softOrange: "#FF8A65",   // lighter orange
      gold: "#FFB300",         // yellow accent
      cream: "#FFF3E0",        // light background
      peach: "#FFCC80",
      lightOrange: "#FED8B1",
      yellowOrange:"#FFAE42",
      persianOrange:"#D99058"
    },
  },
},
  plugins: [],
}
