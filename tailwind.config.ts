import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'mf-blue': '#8CD4E6', // Light blue from MF DOOM image
        'mf-dark-blue': '#5CACC4',
        'mf-gray': '#737373',
        'mf-light-gray': '#F5F5F5',
      },
      fontSize: {
        'spotify': ['8rem', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
      },
    },
  },
  plugins: [],
} satisfies Config; 