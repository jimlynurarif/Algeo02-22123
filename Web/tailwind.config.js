const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      'ngijau': '#ebf0e0',
      transparent: 'transparent',
      'primary': '#548b46',
      'secondary': '#ddeee2',
      'accent': '#55aa6f',

    }
  },
  plugins: [],
});