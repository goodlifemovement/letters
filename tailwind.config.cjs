/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Rubik", "sans-serif"],
        heading: ["Syne", "sans-serif"],
      },
    },
  },
  plugins: [],
};
