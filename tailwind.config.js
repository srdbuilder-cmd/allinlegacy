/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#DAD0C0',
        secondary: '#545656',
        brandBlack: '#231F20',
        brandWhite: '#FFFFFF',
        cardShading: '#F4F0E8',
        forest: '#37543F',
        forestDeep: '#2C4433',
        mustard: '#8E6F29',
        beigeLight: '#F4F0E8',
        danger: '#A5442E',
        success: '#5C6B3D',
        info: '#4A5D6B',
      },
      fontFamily: {
        display: ['"Hertical Sans"', '"Arial Narrow"', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
