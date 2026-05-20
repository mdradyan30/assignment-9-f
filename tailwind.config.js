/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        vault: {
          ink: '#1a1a1a',
          paper: '#fbfaf7',
          cream: '#f5f2eb',
          rule: '#e8e4db',
          muted: '#6b6862',
          accent: '#8b3a2f',
          'accent-soft': '#b85a4a',
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 0.5s ease forwards',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        ideavaultlight: {
          primary: '#1a1a1a',
          'primary-content': '#fbfaf7',
          secondary: '#8b3a2f',
          'secondary-content': '#fbfaf7',
          accent: '#8b3a2f',
          'accent-content': '#fbfaf7',
          neutral: '#1a1a1a',
          'neutral-content': '#fbfaf7',
          'base-100': '#fbfaf7',
          'base-200': '#f5f2eb',
          'base-300': '#e8e4db',
          'base-content': '#1a1a1a',
          info: '#3b6ea5',
          success: '#4a7c59',
          warning: '#b8862c',
          error: '#a83232',
          '--rounded-box': '0.25rem',
          '--rounded-btn': '0.125rem',
          '--rounded-badge': '0.125rem',
          '--btn-text-case': 'none',
        },
      },
      {
        ideavaultdark: {
          primary: '#fbfaf7',
          'primary-content': '#1a1a1a',
          secondary: '#c97a6b',
          'secondary-content': '#1a1a1a',
          accent: '#c97a6b',
          'accent-content': '#1a1a1a',
          neutral: '#fbfaf7',
          'neutral-content': '#1a1a1a',
          'base-100': '#141312',
          'base-200': '#1c1b1a',
          'base-300': '#2a2825',
          'base-content': '#ebe7df',
          info: '#7ba3d4',
          success: '#7ab088',
          warning: '#d4a85a',
          error: '#d46b6b',
          '--rounded-box': '0.25rem',
          '--rounded-btn': '0.125rem',
          '--rounded-badge': '0.125rem',
          '--btn-text-case': 'none',
        },
      },
    ],
    darkTheme: 'ideavaultdark',
  },
};
