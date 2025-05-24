/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Include your main HTML file
    "./src/**/*.{js,ts,jsx,tsx,vue}", // Include all JS, TS, JSX, TSX, and Vue files in src and its subdirectories
  ],
  theme: {
    extend: {
      fontFamily: {
        // Add your custom font here
        pixelify: ['"Pixelify Sans"', "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--var(--foreground))", // Corrected: Should be var(--foreground)
      },
    },
  },
  plugins: [],
};
