import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-thai)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        thai: ['var(--font-thai)', 'sans-serif'],
      },
      colors: {
        studio: {
          bg: '#08090D',
          surface: '#111318',
          subsurface: '#0D0E12',
          border: '#252832',
          muted: '#6B7280',
          secondary: '#9CA3AF',
          red: '#E53935',
        }
      }
    },
  },
  plugins: [],
};
export default config;
