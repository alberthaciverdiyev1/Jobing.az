/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,js,ejs}"];
export const theme = {
  extend: {
    height: {
      '38': '1660px',
    },
    boxShadow: {
      'bottom-only': '0px 4px 6px rgba(0, 0, 0, 10)',
    },
  },
};
export const plugins = [];
