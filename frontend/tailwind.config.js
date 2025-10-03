/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      // Correct Structure: Each theme is its own object in the array
      {
        mediavault_dark: {
          "primary": "#8A2BE2",
          "primary-content": "#FFFFFF",
          "secondary": "#00FFFF",
          "secondary-content": "#0D1117",
          "accent": "#FF00FF",
          "accent-content": "#FFFFFF",
          "neutral": "#1A1A2D",
          "neutral-content": "#A0AEC0",
          "base-100": "#0D1117",
          "base-200": "#1A1A2D",
          "base-300": "#2C2C44",
          "base-content": "#E0E0E0",
          "info": "#00B5FF",
          "success": "#00A67D",
          "warning": "#FFC700",
          "error": "#FF5757",
        },
      },
      {
        light: {
          "primary": "#3498DB",
          "primary-content": "#FFFFFF",
          "secondary": "#9B59B6",
          "secondary-content": "#FFFFFF",
          "accent": "#9B59B6",
          "accent-content": "#FFFFFF",
          "neutral": "#ECF0F1",
          "neutral-content": "#2C3E50",
          "base-100": "#FFFFFF",
          "base-200": "#F0F2F5",
          "base-300": "#E0E5E9",
          "base-content": "#2C3E50",
          "info": "#3498DB",
          "success": "#00A67D",
          "warning": "#F1C40F",
          "error": "#E74C3C",
        },
      },
    ],
  },
}