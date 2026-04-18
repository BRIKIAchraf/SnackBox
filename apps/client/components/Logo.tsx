"use client";

import { motion } from "framer-motion";

export const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizeClass = size === "sm" ? "w-12 h-12" : size === "md" ? "w-16 h-16" : size === "lg" ? "w-24 h-24" : "w-32 h-32";

  return (
    <div className={`relative logo-container ${sizeClass} flex items-center justify-center`}>
      <img
        src="/Logo1.png"
        alt="Snack Box Logo"
        className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,106,0,0.3)] transition-all hover:scale-105 duration-300"
      />
    </div>
  );
};

