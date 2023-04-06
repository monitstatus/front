module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
        '48': 'repeat(48, minmax(0, 1fr))',
        '96': 'repeat(96, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
