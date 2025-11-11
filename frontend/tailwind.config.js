module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffbeb',   // Lightest gold
          100: '#fef3c7',  // Very light gold
          200: '#fde68a',  // Light gold
          300: '#fcd34d',  // Soft gold
          400: '#fbbf24',  // Medium gold
          500: '#f59e0b',  // Rich gold (main)
          600: '#d97706',  // Deep gold
          700: '#b45309',  // Darker gold
          800: '#92400e',  // Bronze
          900: '#78350f',  // Deep bronze
          950: '#451a03',  // Darkest bronze
        },
        accent: {
          50: '#fdf2f8',   // Light rose gold
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',  // Rose gold
          600: '#db2777',
          700: '#be185d',
          800: '#9f1239',
          900: '#831843',
        },
        luxury: {
          50: '#fefce8',   // Champagne
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',  // Gold yellow
          500: '#eab308',
          600: '#ca8a04',  // Deep gold
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
    },
  },
  plugins: [],
}
