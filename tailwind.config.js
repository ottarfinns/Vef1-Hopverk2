/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html', './src/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['winter', 'cupcake'],
  },
};
