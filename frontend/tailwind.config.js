/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '750px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
          500: '#09090b',
          600: '#18181b',
          700: '#27272a',
          800: '#3f3f46',
          900: '#000000',
        },
        brand: {
          soft: '#f4f4f5',
          ink: '#09090b',
          'ink-2': '#27272a',
          mute: '#71717a',
          hairline: '#e4e4e7',
          surface: '#ffffff',
          sale: '#ef4444',
          accent: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      borderRadius: {
        'card': '14px',
        'tile': '20px'
      }
    },
  },
  plugins: [],
}
