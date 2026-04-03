// ATP Scales — Tailwind config: black + gold + silver brand identity
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      colors: {
        atp: {
          black:       '#060606',
          dark:        '#0C0C0C',
          card:        '#111111',
          border:      '#1C1C1C',
          muted:       '#262626',
          subtle:      '#333333',
          gold:        '#C9A84C',
          'gold-light':'#E2C06A',
          'gold-dim':  '#9A7A35',
          silver:      '#D8D8D8',
          white:       '#F2F2F2',
          text:        '#EBEBEB',
          dim:         '#888888',
          faint:       '#444444',
        },
      },
      backgroundImage: {
        'grid-pattern':   "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' width='40' height='40' fill='none' stroke='rgb(255 255 255 / 0.025)'%3e%3cpath d='M0 .5H39.5V40'/%3e%3c/svg%3e\")",
        'gold-gradient':  'linear-gradient(135deg, #9A7A35 0%, #E2C06A 50%, #C9A84C 100%)',
        'silver-gradient':'linear-gradient(135deg, #B0B0B0 0%, #F2F2F2 55%, #C0C0C0 100%)',
        'hero-glow':      'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(201,168,76,0.10), transparent)',
      },
      animation: {
        'fade-in':  'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.45s ease-out',
        'shimmer':  'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        gold:    '0 0 40px rgba(201,168,76,0.12)',
        'gold-sm':'0 0 16px rgba(201,168,76,0.08)',
        card:    '0 1px 4px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
