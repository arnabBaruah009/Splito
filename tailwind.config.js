/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-green": "#55efc4",
        "custom-black": "#000000",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(315deg, #55efc4 0%, #000000 74%)",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        josefin: ["Josefin Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [nextui()],
};
