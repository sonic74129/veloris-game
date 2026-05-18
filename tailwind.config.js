/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          0: '#0a0807', 1: '#0f0c0a', 2: '#15110d', 3: '#1c1712', 4: '#2a2118',
        },
        gold: {
          1: '#5a4828', 2: '#8a6f3d', 3: '#c9a55a', 4: '#e3c886', 5: '#f6e6bf',
        },
        warm: {
          1: '#f4ebd8', 2: '#c7b896', 3: '#8a7a5d', 4: '#5a4f3e',
        },
        accent: {
          cyan: '#46D9D1', purple: '#9B6CFF', green: '#53D36B',
          blue: '#4CA3FF', pink: '#E96AAE', red: '#E65A4F',
        },
      },
      fontFamily: {
        brand: ['Cinzel', 'Cormorant Garamond', 'serif'],
        serif: ['Cormorant Garamond', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'ui-monospace', 'monospace'],
        cn: ['"Noto Serif SC"', '"Songti SC"', 'serif'],
        cns: ['"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 24px rgba(227,200,134,0.45), inset 0 0 12px rgba(227,200,134,0.15)',
        'gold-soft': '0 0 18px rgba(201,165,90,0.25)',
        'red-glow': '0 0 18px rgba(230,90,79,0.55)',
      },
      keyframes: {
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 10px rgba(227,200,134,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(227,200,134,0.6)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        glow: 'glow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

