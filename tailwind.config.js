/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        27: "6.75rem",
        57: "14.25rem",
        58: "14.5rem",
        112: "28rem",
        160: "40rem",
        400: "100rem",
      },
      animation: {
        appear1: "appear1 1s ease-in-out 1",
      },
      keyframes: {
        appear1: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
    fontFamily: {
      gothic: ['"Didact Gothic"'],
    },
  },
  plugins: [],
};
