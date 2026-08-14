/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hud: {
          bg: '#0b1220',
          panel: '#111827',
          border: '#1e293b',
          accent: '#38bdf8',
          warn: '#f59e0b',
          ok: '#34d399',
          danger: '#f87171',
        },
      },
      fontFamily: {
        hud: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        hud: '0 0 0 1px rgba(56,189,248,0.15), 0 8px 24px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
