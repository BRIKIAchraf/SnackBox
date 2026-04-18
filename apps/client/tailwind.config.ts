import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#FF6A00",
          hover: "#CC5500",
        },
      },
    },
  },
  plugins: [
    plugin(function({ addComponents }) {
      addComponents({
        '.btn-primary': {
          '@apply relative overflow-hidden bg-[#FF6A00] text-white font-black px-8 py-4 rounded-2xl transition-all duration-300 hover:bg-[#CC5500] active:scale-95 shadow-2xl': {},
          'box-shadow': '0 0 20px rgba(255, 106, 0, 0.3)',
        },
        '.glass-card': {
          '@apply bg-[#1A1A1A] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500': {},
        },
        '.input-field': {
          '@apply w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 focus:border-[#FF6A00]/40 focus:bg-white/[0.07] font-bold text-white': {},
        },
      })
    }),
  ],
};
export default config;
