import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#f2b138',
          light: '#f2d377',
          bronze: '#8c5a1c',
          ink: '#0d0d0d',
          paper: '#f7f5ef',
        },
      },
    },
  },
  plugins: [],
}

export default config
