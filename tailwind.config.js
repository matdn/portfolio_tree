/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': {
          'base': '#344054',
          'light': '#98A2B3',
        },
        'secondary': '#98A2B3',
        'background': '#FFF',
        'grey': {
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#E4E7EC',
          300: '#D0D5DD',
          500: '#667085',
          600: '#475467',
          700: '#344054',
        },
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        norman: ['Norman'],
        mabry: ['Mabry'],
        neue: ['NeueHaas Grotesk Display'],
        roboto: ['Roboto'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

