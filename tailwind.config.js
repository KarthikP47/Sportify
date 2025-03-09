/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#1e40af",
          secondary: "#f59e0b",
        },
        fontFamily: {
          sans: ["Inter", "sans-serif"],
        },
        screens: {
          xs: "480px",
        },
      },
    },
    plugins: [
      async () => {
        const forms = await import("@tailwindcss/forms");
        return forms.default();
      },
      async () => {
        const typography = await import("@tailwindcss/typography");
        return typography.default();
      },
    ],
  };