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
        background: "var(--admin-bg)",
        foreground: "#FFFFFF",
        primary: "#FF6A00",
      },
    },
  },
  plugins: [
    plugin(function({ addComponents }) {
        addComponents({
          '.sidebar-link': {
            '@apply flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:bg-white/5': {},
          },
          '.sidebar-link.active': {
            '@apply text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/20 shadow-[0_0_20px_rgba(255,106,0,0.1)]': {},
          },
          '.stat-card': {
            '@apply p-6 bg-[#1A1A1A] border border-white/5 rounded-2xl transition-all hover:border-[#FF6A00]/30': {},
          },
          '.admin-table': {
            '@apply w-full text-left border-collapse': {},
          },
          '.admin-table th': {
            '@apply px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-white/5': {},
          },
          '.admin-table td': {
            '@apply px-4 py-4 border-b border-white/5 text-sm': {},
          },
          '.badge-primary': {
            '@apply bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase': {},
          }
        })
    }),
  ],
};
export default config;
