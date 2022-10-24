/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        57: "14.25rem",
        58: "14.5rem",
        112: "28rem",
        160: "40rem",
        400: "100rem",
      },
    },
    fontFamily: {
      gothic: ['"Didact Gothic"'],
    },
  },
  plugins: [],
};
