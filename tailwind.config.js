/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* ----------------------------------------------------------------
         Colors — indigo-violet primary, warm amber accent
         ---------------------------------------------------------------- */
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          raised:  'var(--color-surface-raised)',
          overlay: 'var(--color-surface-overlay)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          subtle:  'var(--color-border-subtle)',
        },
        dark: {
          50:  '#1c1d3a',
          100: '#16172e',
          200: '#111227',
          300: '#0c0d1a',
          400: '#090a14',
          500: '#06060f',
          900: '#020204',
        },
      },

      /* ----------------------------------------------------------------
         Typography — Geist font variables
         ---------------------------------------------------------------- */
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      /* ----------------------------------------------------------------
         Spacing extensions
         ---------------------------------------------------------------- */
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '30':  '7.5rem',
        '34':  '8.5rem',
        '68':  '17rem',
        '76':  '19rem',
        '84':  '21rem',
        '88':  '22rem',
        '92':  '23rem',
        '100': '25rem',
        '120': '30rem',
        '144': '36rem',
      },

      /* ----------------------------------------------------------------
         Border Radius
         ---------------------------------------------------------------- */
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      /* ----------------------------------------------------------------
         Backdrop Blur
         ---------------------------------------------------------------- */
      backdropBlur: {
        xs:   '2px',
        '2xl': '40px',
        '3xl': '64px',
      },

      /* ----------------------------------------------------------------
         Box Shadows — premium layered shadows
         ---------------------------------------------------------------- */
      boxShadow: {
        'soft-xs':   '0 1px 2px hsl(var(--shadow-color) / 0.04)',
        'soft-sm':   '0 1px 3px hsl(var(--shadow-color) / 0.06), 0 1px 2px hsl(var(--shadow-color) / 0.04)',
        'soft':      '0 2px 8px hsl(var(--shadow-color) / 0.06), 0 1px 3px hsl(var(--shadow-color) / 0.04)',
        'soft-md':   '0 4px 16px hsl(var(--shadow-color) / 0.08), 0 2px 4px hsl(var(--shadow-color) / 0.04)',
        'soft-lg':   '0 8px 30px hsl(var(--shadow-color) / 0.10), 0 4px 8px hsl(var(--shadow-color) / 0.04)',
        'soft-xl':   '0 16px 48px hsl(var(--shadow-color) / 0.12), 0 6px 16px hsl(var(--shadow-color) / 0.06)',
        'soft-2xl':  '0 24px 64px hsl(var(--shadow-color) / 0.16), 0 8px 20px hsl(var(--shadow-color) / 0.08)',
        'glow-sm':   '0 0 8px rgba(99, 102, 241, 0.25), 0 0 16px rgba(99, 102, 241, 0.10)',
        'glow':      '0 0 12px rgba(99, 102, 241, 0.30), 0 0 32px rgba(99, 102, 241, 0.15)',
        'glow-lg':   '0 0 20px rgba(99, 102, 241, 0.35), 0 0 48px rgba(99, 102, 241, 0.18), 0 0 72px rgba(99, 102, 241, 0.08)',
        'glow-accent': '0 0 12px rgba(245, 158, 11, 0.30), 0 0 32px rgba(245, 158, 11, 0.15)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
      },

      /* ----------------------------------------------------------------
         Background Images — CSS-based only (no massive SVGs)
         ---------------------------------------------------------------- */
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh':   'linear-gradient(-45deg, #6366f1, #8b5cf6, #7c3aed, #4f46e5)',
      },

      /* ----------------------------------------------------------------
         Animations
         ---------------------------------------------------------------- */
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'glow':        'glow 2.4s ease-in-out infinite alternate',
        'shimmer':     'shimmer 1.8s ease-in-out infinite',
        'aurora':      'aurora 12s ease infinite',
        'slideUp':     'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slideDown':   'slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scaleIn':     'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fadeIn':      'fadeIn 0.35s ease-out',
        'pulse-glow':  'pulseGlow 3s ease-in-out infinite',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient':    'aurora 8s ease infinite',
        'mesh-rotate': 'meshRotate 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 6px rgba(99,102,241,0.15), 0 0 20px rgba(99,102,241,0.08)' },
          '100%': { boxShadow: '0 0 14px rgba(99,102,241,0.40), 0 0 40px rgba(99,102,241,0.15)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        aurora: {
          '0%':   { backgroundPosition: '0% 50%',   backgroundSize: '200% 200%' },
          '25%':  { backgroundPosition: '50% 0%',   backgroundSize: '250% 250%' },
          '50%':  { backgroundPosition: '100% 50%', backgroundSize: '200% 200%' },
          '75%':  { backgroundPosition: '50% 100%', backgroundSize: '250% 250%' },
          '100%': { backgroundPosition: '0% 50%',   backgroundSize: '200% 200%' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        meshRotate: {
          '0%':   { transform: 'rotate(0deg) scale(1)' },
          '33%':  { transform: 'rotate(120deg) scale(1.08)' },
          '66%':  { transform: 'rotate(240deg) scale(0.95)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
