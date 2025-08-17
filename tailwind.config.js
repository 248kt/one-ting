/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif','system-ui','-apple-system','Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans','Liberation Sans','sans-serif',
          'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'
        ]
      },
      colors: {
        base: { light: '#ffffff', dark: '#0b0c10' }
      },
      boxShadow: { soft: '0 10px 30px rgba(0,0,0,0.07)' }
    }
  },
  plugins: []
}