import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#FDFAF8',        // warm off-white
        surface: '#FFFFFF',
        surfaceAlt: '#F7F0EB',  // warm clay tint
        border: 'rgba(100,50,30,0.09)',
        ink: '#1C1410',         // warm near-black
        muted: '#7A6558',       // warm brown-gray
        accent: '#CC785C',      // Anthropic terra cotta
        accentDark: '#B5614A',  // hover state
        accentLight: '#F5E8E2', // light tint for badges
        warm: '#2A1A12',        // deep warm brown for dark sections
      },
      fontFamily: {
        sans: ['var(--font-inter-tight)', 'sans-serif'],
        display: ['var(--font-oswald)', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}

export default config
