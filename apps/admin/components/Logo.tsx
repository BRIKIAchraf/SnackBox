"use client";

import { motion } from "framer-motion";

export const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizeClass = size === "sm" ? "w-10 h-10" : size === "md" ? "w-14 h-14" : size === "lg" ? "w-20 h-20" : "w-28 h-28";

  return (
    <div className={`relative logo-container ${sizeClass} flex items-center justify-center`}>
      <img
        src="/logo.jpg"
        alt="Snack Box Admin Logo"
        className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,106,0,0.5)] transition-all hover:scale-105 duration-300"
      />
    </div>
  );
};
