/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        walnut: {
          DEFAULT: "#4A2816",
          light: "#754226",
          dark: "#1F120C",
        },
        sand: {
          DEFAULT: "#D9C8B5",
          light: "#F5EDE3",
          dark: "#BFA993",
        },
        sienna: {
          DEFAULT: "#C85D18",
          light: "#EB7B32",
          dark: "#963D0A",
        },
        sage: {
          DEFAULT: "#267A59",
          light: "#3F9874",
          dark: "#14563D",
        },
        ivory: "#FFFCF8",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        data: ["var(--font-plexmono)", "monospace"],
      },
      boxShadow: {
        carve:
          "6px 6px 14px rgba(58,42,30,0.18), -4px -4px 10px rgba(255,251,242,0.6)",
        "carve-inset":
          "inset 4px 4px 10px rgba(58,42,30,0.15), inset -3px -3px 8px rgba(255,251,242,0.5)",
        glass: "0 8px 32px rgba(58,42,30,0.12)",
      },
      clipPath: {
        notch:
          "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
      },
      backgroundImage: {
        grain: "url('/textures/grain.svg')",
      },
    },
  },
  plugins: [],
};
