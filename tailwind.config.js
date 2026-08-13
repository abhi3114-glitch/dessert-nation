/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          bg: '#FBF8F3', // Warm Cream / Ivory
          surface: '#FFFFFF', // Clean White
          subtle: '#F4EDE4', // Soft Warm Cream Surface
          border: '#E8DFD5', // Subtle Warm Border
          text: '#2A211D', // Deep Coffee Espresso Text
          muted: '#766B63', // Warm Slate Muted Text
          caramel: '#C66F45', // Primary Terracotta / Caramel Accent
          'caramel-hover': '#B35E35',
          gold: '#D9A441', // Soft Golden Yellow Accent
          sage: '#4F8A68', // Soft Fresh Green Success
          danger: '#C94A43', // Soft Red Danger
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
    },
  },
  plugins: [],
}
