tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          red:      '#E30513',
          redDark:  '#B00410',
          black:    '#0A0A0B',
          charcoal: '#111114',
          surface:  '#1C1C21',
          elevated: '#252529',
          gold:     '#F5C518',
          glow:     '#FF4D1C',
          white:    '#F8F8FA',
          muted:    '#9090A0',
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        display: '0.04em',
      }
    }
  }
}
