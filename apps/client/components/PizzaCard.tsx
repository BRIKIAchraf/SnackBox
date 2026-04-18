"use client";

import { Plus, Flame, Clock, Info } from "lucide-react";
import { useCartStore } from "../store/cart-store";
import { motion } from "framer-motion";
import { API_URL } from "../lib/api-config";

interface PizzaCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imagePath?: string;
  onCustomize?: () => void;
}

export const PizzaCard = ({ id, name, description, price, imageUrl, imagePath, onCustomize }: PizzaCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 group transition-all hover:bg-[#151515] hover:border-primary/20"
    >
      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6">
        <img
          src={imagePath ? `${API_URL}${imagePath}` : imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-3 right-3 flex gap-2">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onCustomize?.();
                }}
                className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 hover:bg-primary hover:text-black transition-all"
            >
                <Info className="w-5 h-5" />
            </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-black uppercase italic tracking-tight group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-relaxed h-8">{description}</p>
        
        <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-black">{typeof price === 'number' ? price.toFixed(2) : parseFloat(price as any).toFixed(2)}€</span>
            <button 
                onClick={() => addItem({ id, name, price: typeof price === 'number' ? price : parseFloat(price as any), quantity: 1, imageUrl: imagePath || imageUrl })}
                className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-xl shadow-primary/20 hover:scale-110 transition-all"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
      </div>
    </motion.div>
  );
};
