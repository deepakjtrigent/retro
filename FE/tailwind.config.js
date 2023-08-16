/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#0064fe",
        "primary-shade-color": "#00388f",
        "primary-pale-color": "#e5effe",
        "primary-highlight-color": "#5c9bff",
        "text-pale-color": "#e5effe",
        "scrum-background-color": "#ffffff",
        "scrum-text-color": "#848b99",
      },
      animation: {
        "card-animation": "card 0.4s",
      },
      keyframes: {
        card: {
          "0%": {
            transform: "translateY(-10px)",
            opacity: "0",
            backgroundColor: "#0f83f8",
          },
          "100%": {
            transform: "translateY(0%)",
            opacity: "100",
            backgroundColor: "#0f83f8",
          },
        },
      },
      screens: {
     
      },
    },
  },
  plugins: [],
};
