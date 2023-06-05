module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        "header-image": "url('/src/utils/header.jpg)",
      }),
    },
    variants: {
      extend: {
        visibility: ["group-hover"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
