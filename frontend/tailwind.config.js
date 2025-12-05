/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Minimal black/white palette with accent
        accent: '#00e572', // Subtle green accent
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        info: '#2563eb',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.8125rem', { lineHeight: '1.5' }],
        'base': ['0.9375rem', { lineHeight: '1.6' }],
        'lg': ['1.0625rem', { lineHeight: '1.5' }],
        'xl': ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['2rem', { lineHeight: '1.2' }],
        '4xl': ['2.5rem', { lineHeight: '1.1' }],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'offset': '5px 5px 0px #eee',
        'offset-dark': '5px 5px 0px #333',
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.625rem',
        'xl': '0.75rem',
        'pill': '50px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(#d1d1d1 1px, transparent 1px)',
        'dot-pattern-dark': 'radial-gradient(#333 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '24px 24px',
      },
    },
  },
  plugins: [],
}

