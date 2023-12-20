/** @type {import('tailwindcss').Config} */

import arrowDropdown from './src/plugins/arrow-anime.js';

export default {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: { 
        "Anton": ['Anton', 'sans-serif'],
        "Manrope": ['Manrope', 'sans-serif'],
      },
      colors: { 
        "lpp-yellow": '#FFD15B',
        "lpp-black": '#1B1B1B',
        "lpp-grey": '#7A7A7A',
        "lpp-lightgrey": '#C6C6C6',
        "lpp-bg-body" : "#EDEDED",
      },
      backgroundPosition: {
        "right-15-center": 'right 15px center',
        "right-20-center": 'right 20px center',
      },
    },
  },
  plugins: [
    arrowDropdown,
  ],
}