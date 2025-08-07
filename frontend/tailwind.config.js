/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'mint-green': 'var(--mint-green)',
        'lavender': 'var(--lavender)',
        'peachy-pink': 'var(--peachy-pink)',
        'warm-coral': 'var(--warm-coral)',
        'soft-cream': 'var(--soft-cream)',
        'muted': 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        'border': 'var(--border)',
        'ring': 'var(--ring)',
      },
      borderRadius: {
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}