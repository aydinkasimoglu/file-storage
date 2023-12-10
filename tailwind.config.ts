import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: 'hsl(var(--primary-hover))',
          disabled: 'hsl(var(--primary-disabled))',
        },
        input: {
          DEFAULT: 'hsl(var(--input))',
          hover: 'hsl(var(--input-hover))',
        },
        'transparent-hover': 'rgba(var(--transparent-hover))',
      },
      minHeight: {
        screen: "100dvh",
      },
    },
  },
  plugins: [],
};
export default config;