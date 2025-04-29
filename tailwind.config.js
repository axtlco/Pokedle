/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'pokemon-red': 'rgb(var(--color-pokemon-red) / <alpha-value>)',
        'pokemon-blue': 'rgb(var(--color-pokemon-blue) / <alpha-value>)',
        'pokemon-yellow': 'rgb(var(--color-pokemon-yellow) / <alpha-value>)',
        'correct': '#6AAA64',
        'present': '#C9B458',
        'absent': '#787C7E',
        'key-bg': '#D3D6DA',
        'key-bg-dark': '#818384',
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif']
      },
      animation: {
        'flip': 'flip 0.6s ease',
        'bounce': 'bounce 0.3s ease',
        'shake': 'shake 0.3s ease'
      },
      backgroundImage: {
        'pokeball-pattern': "url('/pokeball-pattern.svg')"
      }
    },
  },
  plugins: [],
};