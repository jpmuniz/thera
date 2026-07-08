import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        line: "#d7dee8",
        muted: "#667085",
        surface: "#f6f8fb",
        brand: "#0f766e",
        accent: "#b45309",
        success: "#15803d",
        danger: "#b91c1c"
      },
      boxShadow: {
        soft: "0 16px 50px rgb(23 32 51 / 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
