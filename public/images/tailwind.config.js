/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // MF DOOM Old School Villain Color Palette
        'doom-black': '#000000',
        'doom-dark': '#111111',
        'doom-charcoal': '#1a1a1a',
        'doom-gray': '#2a2a2a',
        'doom-light-gray': '#3a3a3a',
        'doom-silver': '#c0c0c0',
        'doom-gold': '#ffd700',
        'doom-bronze': '#cd7f32',
        'doom-blood': '#8b0000',
        'doom-red': '#dc143c',
        'doom-mask': '#4a4a4a',
        'doom-metal': '#708090',
        
        // Gritty grays for comic book effect
        gray: {
          950: '#0a0a0a',
          900: '#171717',
          850: '#1f1f1f',
          800: '#262626',
          750: '#2d2d2d',
          700: '#404040',
          600: '#525252',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
          200: '#e5e5e5',
          100: '#f5f5f5',
          50: '#fafafa',
        },
        
        // Villain accent colors
        villain: {
          black: '#000000',
          charcoal: '#1a1a1a',
          gray: '#2a2a2a',
          silver: '#c0c0c0',
          gold: '#ffd700',
          bronze: '#cd7f32',
          blood: '#8b0000',
          red: '#dc143c',
        },
        
        // Keep status colors but make them grittier
        success: {
          950: '#14532d',
          900: '#166534',
          800: '#16a34a',
          700: '#15803d',
          600: '#059669',
          500: '#10b981',
          400: '#34d399',
          300: '#6ee7b7',
          200: '#a7f3d0',
          100: '#d1fae5',
          50: '#ecfdf5',
        },
        warning: {
          950: '#451a03',
          900: '#92400e',
          800: '#c2410c',
          700: '#ea580c',
          600: '#ea580c',
          500: '#f97316',
          400: '#fb923c',
          300: '#fdba74',
          200: '#fed7aa',
          100: '#ffedd5',
          50: '#fff7ed',
        },
        error: {
          950: '#450a0a',
          900: '#7f1d1d',
          800: '#991b1b',
          700: '#b91c1c',
          600: '#dc2626',
          500: '#ef4444',
          400: '#f87171',
          300: '#fca5a5',
          200: '#fecaca',
          100: '#fee2e2',
          50: '#fef2f2',
        }
      },
      
      fontFamily: {
        // Old school villain fonts
        'villain': ['Impact', 'Arial Black', 'sans-serif'],
        'comic': ['Comic Sans MS', 'cursive'],
        'graffiti': ['Brush Script MT', 'cursive'],
        'display': ['Bebas Neue', 'Impact', 'sans-serif'],
        'mono': ['Courier New', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        
        // DOOM-specific villain sizes
        'doom-xs': ['0.8rem', { lineHeight: '1.2rem', letterSpacing: '0.1em', fontWeight: '800' }],
        'doom-sm': ['1rem', { lineHeight: '1.4rem', letterSpacing: '0.1em', fontWeight: '800' }],
        'doom-base': ['1.2rem', { lineHeight: '1.6rem', letterSpacing: '0.05em', fontWeight: '900' }],
        'doom-lg': ['1.8rem', { lineHeight: '2rem', letterSpacing: '0.05em', fontWeight: '900' }],
        'doom-xl': ['2.5rem', { lineHeight: '2.8rem', letterSpacing: '0.02em', fontWeight: '900' }],
        'doom-2xl': ['3.5rem', { lineHeight: '3.8rem', letterSpacing: '0.02em', fontWeight: '900' }],
        'doom-3xl': ['5rem', { lineHeight: '5.2rem', letterSpacing: '-0.02em', fontWeight: '900' }],
        'doom-hero': ['8rem', { lineHeight: '7.5rem', letterSpacing: '-0.05em', fontWeight: '900' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      borderRadius: {
        // Sharp, minimal radius for villain aesthetic
        'none': '0',
        'sm': '0.125rem',
        'md': '0.25rem',
        'lg': '0.375rem',
        'xl': '0.5rem',
        '2xl': '0.625rem',
        '3xl': '0.75rem',
        'villain': '0.25rem', // Sharp but not completely square
      },
      
      boxShadow: {
        // Dramatic, harsh shadows for villain effect
        'villain-sm': '0 2px 8px rgba(0, 0, 0, 0.8)',
        'villain-md': '0 4px 16px rgba(0, 0, 0, 0.6)',
        'villain-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'villain-xl': '0 16px 48px rgba(0, 0, 0, 0.4)',
        'villain-2xl': '0 25px 50px rgba(0, 0, 0, 0.5)',
        'villain-inner': 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
        
        // Metallic/gold glow effects
        'gold-glow': '0 0 20px rgba(255, 215, 0, 0.5)',
        'silver-glow': '0 0 15px rgba(192, 192, 192, 0.4)',
        'red-glow': '0 0 25px rgba(220, 20, 60, 0.6)',
        
        // Comic book style
        'comic': '4px 4px 0px rgba(0, 0, 0, 0.8)',
        'comic-lg': '8px 8px 0px rgba(0, 0, 0, 0.6)',
      },
      
      animation: {
        'villain-pulse': 'villainPulse 2s ease-in-out infinite',
        'mask-flicker': 'maskFlicker 3s ease-in-out infinite',
        'gold-shine': 'goldShine 2s linear infinite',
        'comic-pop': 'comicPop 0.6s ease-out',
        'doom-entrance': 'doomEntrance 1.2s ease-out',
        'graffiti-write': 'graffitiWrite 2s ease-out',
        'villain-hover': 'villainHover 0.3s ease-out',
      },
      
      keyframes: {
        villainPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            transform: 'scale(1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
            transform: 'scale(1.02)' 
          },
        },
        maskFlicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '75%': { opacity: '0.9' },
        },
        goldShine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        comicPop: {
          '0%': { transform: 'scale(0.95) rotate(-1deg)' },
          '50%': { transform: 'scale(1.05) rotate(1deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        doomEntrance: {
          '0%': { 
            transform: 'translateY(50px) scale(0.9)',
            opacity: '0',
            filter: 'blur(10px)' 
          },
          '100%': { 
            transform: 'translateY(0) scale(1)',
            opacity: '1',
            filter: 'blur(0)' 
          },
        },
        graffitiWrite: {
          '0%': { 
            strokeDasharray: '0 100',
            opacity: '0' 
          },
          '50%': { opacity: '1' },
          '100%': { 
            strokeDasharray: '100 0',
            opacity: '1' 
          },
        },
        villainHover: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-2px) scale(1.05)' },
        },
      },
      
      backgroundImage: {
        // Dark villain gradients
        'villain-dark': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)',
        'villain-metal': 'linear-gradient(135deg, #4a4a4a 0%, #708090 50%, #c0c0c0 100%)',
        'villain-gold': 'linear-gradient(135deg, #cd7f32 0%, #ffd700 50%, #ffed4e 100%)',
        'villain-blood': 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
        
        // Texture overlays for gritty effect
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
        'grunge-texture': "url('data:image/svg+xml,%3Csvg width=\"200\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"grungeFilter\"%3E%3CfeTurbulence type=\"turbulence\" baseFrequency=\"0.04\" numOctaves=\"3\"/%3E%3CfeDisplacementMap in=\"SourceGraphic\" scale=\"5\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23grungeFilter)\" opacity=\"0.08\"/%3E%3C/svg%3E')",
      },
      
      backdropBlur: {
        'xs': '2px',
      },
      
      transitionTimingFunction: {
        'villain': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'comic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'doom': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
    },
  },
  plugins: [],
} 