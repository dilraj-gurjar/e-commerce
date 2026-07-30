import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cotton: "#F7F2E9",   // background — raw cotton
        walnut: "#26221B",   // primary text
        indigo: {
          DEFAULT: "#1F3D3B", // deep pine-indigo — brand primary
          light: "#2F5450",
          dark: "#152B29",
        },
        turmeric: {
          DEFAULT: "#C99A2E", // accent — mustard/turmeric
          light: "#E0B65A",
          dark: "#A87F22",
        },
        rose: "#A85C6B",       // sale / clearance tag
        sand: "#EFE7D8",       // card surfaces
        line: "#DDD4C0",       // hairline borders
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
