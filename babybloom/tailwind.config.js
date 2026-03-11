/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        bloom: {
          pink:      '#FFD6E8',
          'pink-dark': '#FF8FAB',
          blue:      '#BDE0FE',
          'blue-dark': '#5AABFF',
          mint:      '#C7F9CC',
          'mint-dark': '#52D17C',
          lavender:  '#E8DCFF',
          'lavender-dark': '#B07FFF',
          yellow:    '#FFF3B0',
          'yellow-dark': '#FFD60A',
          peach:     '#FFDAB9',
          'peach-dark': '#FF9B54',
          cream:     '#FFFBF5',
          white:     '#FFFFFF',
        },
        text: {
          primary: '#3D2C2C',
          secondary: '#7A5C6B',
          muted: '#B09AAA',
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(255, 143, 171, 0.15)',
        'soft-lg': '0 8px 40px rgba(255, 143, 171, 0.2)',
        'card': '0 2px 16px rgba(61, 44, 44, 0.08)',
        'card-hover': '0 12px 40px rgba(61, 44, 44, 0.15)',
        'pink': '0 8px 32px rgba(255, 143, 171, 0.4)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out infinite 1.5s',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backgroundImage: {
        'dots-pattern': "radial-gradient(circle, #FFD6E8 1px, transparent 1px)",
        'wave-pink': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120'%3E%3Cpath fill='%23FFD6E8' d='M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}