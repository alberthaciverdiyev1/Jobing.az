/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,js,ejs}"];
export const theme = {
  extend: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    },
    colors: {
      primary: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#FF8C00',
        600: '#e67e00',
        700: '#cc7000',
        800: '#995400',
        900: '#663800',
      },
    },
    height: {
      '38': '1660px',
    },
    boxShadow: {
      'bottom-only': '0px 4px 6px rgba(0, 0, 0, 10)',
      'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      'card-hover': '0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)',
    },
    borderRadius: {
      '2xl': '1rem',
    },
    animation: {
      'fade-in': 'fadeIn 0.5s ease-out',
      'fade-in-up': 'fadeInUp 0.5s ease-out',
      'fade-in-down': 'fadeInDown 0.4s ease-out',
      'scale-in': 'scaleIn 0.3s ease-out',
      'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      fadeInUp: {
        '0%': { opacity: '0', transform: 'translateY(24px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      fadeInDown: {
        '0%': { opacity: '0', transform: 'translateY(-12px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      scaleIn: {
        '0%': { opacity: '0', transform: 'scale(0.95)' },
        '100%': { opacity: '1', transform: 'scale(1)' },
      },
      pulseSubtle: {
        '0%, 100%': { opacity: '1', transform: 'scale(1)' },
        '50%': { opacity: '0.6', transform: 'scale(0.9)' },
      },
    },
  },
};
export const plugins = [];
