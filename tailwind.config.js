/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        walnut: {
          DEFAULT: "#6B4226",
          light: "#8A6042",
          dark: "#2A1B12",
        },
        sand: {
          DEFAULT: "#DED5C9",
          light: "#F7F3EC",
          dark: "#CBBEAE",
        },
        sienna: {
          DEFAULT: "#B5652D",
          light: "#C97A3E",
          dark: "#8A4A22",
        },
        sage: {
          DEFAULT: "#7C8B6F",
          light: "#93A184",
          dark: "#5E6B53",
        },
        ivory: "#FFFFFF",
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
