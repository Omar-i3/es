/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#090D16',
          secondary: '#0E1526',
          card: '#131B30',
          elevated: '#1A243F',
          light: '#F8FAFC',
          'light-card': '#FFFFFF',
          'light-border': '#E2E8F0',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          glow: 'rgba(16, 185, 129, 0.15)',
        },
        gold: {
          300: '#FDE68A',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          glow: 'rgba(245, 158, 11, 0.15)',
        },
        sukuk: '#3B82F6',
        sharia: {
          halal: '#10B981',
          questionable: '#F59E0B',
          haram: '#EF4444',
        }
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
