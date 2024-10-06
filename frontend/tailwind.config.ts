import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      xl: "1280px",

      smOnly: { max: "767.98px" },
      mdOnly: { min: "768px", max: "1279.98px" },
      notXL: { max: "1279.98px" },
    },
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          md: "1.875rem",
          xl: "1.875rem",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        cardOverlay:
          "linear-gradient(180deg, rgba(0, 0, 0, 0.65) 15.4%, rgba(0, 0, 0, 0.39) 23.9%, rgba(0, 0, 0, 0.00) 34.4%)",
        checkmark: `url(/icons/checkmark.svg)`,
        backdrop: `linear-gradient(rgba(41, 41, 41, 0.40),rgba(41, 41, 41, 0.40))`,
      },
      content: {
        arrowUp: `url(/icons/arrowUp.svg)`,
        arrowRightSm: `url(/icons/arrowRightSm.svg)`,
        formImg1: `url(/images/logo/formImg1.webp)`,
      },
      fontFamily: {
        roboto: ["var(--font-roboto)"],
      },
      fontSize: {
        light: ["22px", "1.5"],
        medium: ["28px", "1.5"],
        lightLarge: ["32px", "1.5"],
        large: ["44px", "1.5"],
        extraLarge: ["86px", "1.5"],
      },
      colors: {
        mainColor: "#707090",
        unactive: "#b7bec7",
        mainBcg: "#888fdc",
      },
    },
  },
  plugins: [],
};
export default config;
