import scrollbar from "tailwind-scrollbar";
/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        handwriting: ['"Patrick Hand"', 'cursive'],
      },
      colors: {
        accent: 'var(--accent-color)',
        error: {
          DEFAULT: " #DC2626",
          light: "#F87171",
        },
        message: {
          text: "#212121",
          received: {
            bg: "#D9D9D9",
          },
          sent: {
            bg: "#B9D3DB",
          },
        },

        // text colors
        'primary': "#252525",
        'primary-dark': "#F4F4F5",
        'secondary': "#292929",
        'secondary-dark': "#D4D4D8",
        'muted': "#515151",
        'muted-dark': "#9797A0",
        'placeholder-txt' : "#71717A",
        
        
        // background colors
        'surface': "#F1F1F1",
        'surface-dark': "#242529",
        'base': "#FAFAFA",
        'base-dark': "#1A1B1F",
        'searchbar':'#D9D9D9',
        'searchbar-dark':'#2F3034',
      },
    },
  },
  plugins: [scrollbar, daisyui],
  daisyui: {
    themes: "false",
  },
};
