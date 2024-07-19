const { default: daisyui } = require("daisyui");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        background: "background-color",
      },
      transitionDuration: {
        200: "200ms",
      },
    },
  },
  plugins: [require("daisyui")],

  daisyui: { themes: ["light"] },
};
