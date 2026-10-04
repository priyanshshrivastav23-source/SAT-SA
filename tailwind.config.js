/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#09090B', // High-contrast dark charcoal
          900: '#18181B',
          800: '#27272A', // Secondary dark charcoal
          700: '#3F3F46',
          600: '#52525B',
          500: '#71717A', // Subtle muted text
          400: '#A1A1AA',
          300: '#D4D4D8',
          200: '#E4E4E7', // Flat 1px light grey border
          100: '#F4F4F5', // Very light neutral grey panel
          50: '#FAFAFA',  // Panel light background
        },
        brand: {
          indigo: '#4F46E5',  // Crisp Indigo
          slate: '#0F172A',   // Deep Slate
          orange: '#EA580C',  // Orange for gaps
          emerald: '#059669', // Emerald Green for resolved items
          amber: '#D97706',   // Amber for warnings/charts
          border: '#E4E4E7',  // Flat 1px light grey border
          bg: '#FFFFFF',      // Pure white
          panel: '#F4F4F5',   // Light neutral grey panel
          subpanel: '#FAFAFA',
          text: '#09090B',    // Dark charcoal
          muted: '#71717A',   // Subtle muted
        },
        gov: {
          dark: '#0F172A',
          card: '#FFFFFF',
          panel: '#F4F4F5',
          border: '#E4E4E7',
          indigo: '#4F46E5',
          emerald: '#059669',
          orange: '#EA580C',
          amber: '#D97706',
          text: '#09090B',
          muted: '#71717A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
