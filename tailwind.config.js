import PrimeUI from 'tailwindcss-primeui'
import tailwindPreset from './src/app/ui/tailwind-presets/tailwind-presets';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindPreset],
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [PrimeUI],
}
