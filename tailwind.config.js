/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'spotify-black': '#000000',
        'spotify-white': '#FFFFFF',
        'mf-blue': '#8CD4E6', // Light blue from MF DOOM image
        'mf-dark-blue': '#5CACC4',
        'mf-gray': '#737373',
        'mf-light-gray': '#F5F5F5',
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'display': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'spotify': ['8rem', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out',
        'fade-in': 'fadeIn 1s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'mobile-slide-in': 'mobileSlideIn 0.3s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        mobileSlideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      screens: {
        'xs': '375px',
        ...require('tailwindcss/defaultTheme').screens,
      },
    },
  },
  plugins: [],
} 