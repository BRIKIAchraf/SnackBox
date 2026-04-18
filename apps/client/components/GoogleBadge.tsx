"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

export const GoogleBadge = () => {
  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 100 }}
      className="fixed top-1/2 right-0 -translate-y-1/2 z-50 bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-gray-100/50 rounded-l-2xl p-3 flex flex-col items-center gap-2 cursor-pointer hover:pr-6 transition-all group duration-300"
      onClick={() => window.open('https://google.com', '_blank')}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
          {/* Simple Google G SVG */}
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="flex gap-[1px]">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#FBBC05] text-[#FBBC05]" />)}
        </div>
        <span className="text-[11px] font-black text-black mt-1 leading-none tracking-tighter">4.9/5</span>
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Avis</span>
      </div>
    </motion.div>
  );
};
