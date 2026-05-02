import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: '#e5e7eb',
        background: '#ffffff',
        foreground: '#0f172a',
        muted: '#f8fafc',
        card: '#ffffff',
        primary: '#0f172a',
      },
    },
  },
  plugins: [],
};

export default config;