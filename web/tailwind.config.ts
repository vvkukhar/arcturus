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
        border: '#e2e8f0',
        background: '#f8fafc',
        foreground: '#0f172a',
        muted: '#f1f5f9',
        card: '#ffffff',
        primary: '#3b82f6',
        primaryHover: '#2563eb',
      },
      boxShadow: {
        'soft': '0 4px 40px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;