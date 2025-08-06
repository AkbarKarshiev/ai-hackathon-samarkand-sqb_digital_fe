import colors from 'tailwindcss/colors'
import { colorPalette } from '../colors/color-palette'

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    screens: {
      // Mobile-first breakpoints
      'xs': '375px',   // Small phones
      'sm': '640px',   // Large phones
      'md': '768px',   // Tablets
      'lg': '1024px',  // Small laptops
      'xl': '1280px',  // Large laptops
      '2xl': '1536px', // Desktop
      // Special mobile breakpoints
      'mobile-s': '320px',
      'mobile-m': '375px',
      'mobile-l': '425px',
      'tablet': '768px',
    },
    colors: {
      ...colorPalette,
      green: colors.green,
      orange: colors.orange,
      zinc: colors.zinc,
      transparent: 'transparent',
      inherit: 'inherit',
      white: colors.white,
      black: colors.black,
    },
    extend: {
      // Safe area spacing with fallbacks
      spacing: {
        'safe-top': 'env(safe-area-inset-top, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 1rem)',
        'safe-left': 'env(safe-area-inset-left, 0px)',
        'safe-right': 'env(safe-area-inset-right, 0px)',
        // Additional utility spacing
        'safe-bottom-sm': 'env(safe-area-inset-bottom, 0.75rem)',
        'safe-bottom-lg': 'env(safe-area-inset-bottom, 1.5rem)',
      },
      // Mobile-specific utilities
      minHeight: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        'touch': '44px',
      },
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      minWidth: {
        'touch': '44px',
      }
    }
  }
}
