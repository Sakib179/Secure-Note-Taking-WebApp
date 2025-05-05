module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        blue: {
          50: '#e6f0ff',
          100: '#bbd6fe',
          200: '#8fbcfd',
          300: '#63a1fc',
          400: '#3787fb',
          500: '#0b6efa',
          600: '#0958c8',
          700: '#074296',
          800: '#042c64',
          900: '#021732'
        }
      }
    }
  },
  plugins: []
};