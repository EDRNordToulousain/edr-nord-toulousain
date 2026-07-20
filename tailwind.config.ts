import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: "#0B1F3A",
        blue: "#246BCE",
        red: "#D92D36",
        coral: "#F04444",
        mist: "#F5F7FA",
        ink: "#172033",
      },
      boxShadow: {
        card: "0 18px 45px rgba(11,31,58,.10)",
      },
    },
  },
  plugins: [],
} satisfies Config;
