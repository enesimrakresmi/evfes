import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      colors: {
        velvet: "#2b0e1f",
        aurora: "#6bd7ff",
        roseglow: "#ff6f91",
        stargold: "#ffd98a"
      },
      boxShadow: {
        star: "0 0 18px rgba(255, 220, 165, .95), 0 0 44px rgba(255, 111, 145, .45)"
      }
    }
  },
  plugins: []
};

export default config;
