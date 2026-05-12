/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        jianghu: {
          bg: '#1a1410',
          panel: '#2a1f16',
          gold: '#c9a96e',
          red: '#c23b3b',
          jade: '#5a9e6f',
          ink: '#e8dcc8',
        },
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
