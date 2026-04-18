"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Plus, Minus, ShoppingBag, Pizza, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PizzaCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  pizza: any;
  onAddToCart: (customized: any) => void;
}

const SIZES = [
    { id: 'junior', name: 'Junior', priceMod: 0, desc: 'Incl.' },
    { id: 'senior', name: 'Sénior', priceMod: 4.50, desc: '+€4.50' },
    { id: 'mega', name: 'Méga', priceMod: 10.00, desc: '+€10.00' }
];

const TOPPINGS = [
    { id: 'cheddar', name: 'Cheddar', price: 1.00},
    { id: 'emmental', name: 'Emmental', price: 1.00},
    { id: 'beef', name: 'Viande hachée', price: 1.00}
];

export const PizzaCustomizer = ({ isOpen, onClose, pizza, onAddToCart }: PizzaCustomizerProps) => {
  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [toppingsCounts, setToppingsCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isOpen) {
        setStep(1);
        setToppingsCounts({});
    }
  }, [isOpen]);

  if (!pizza) return null;

  const totalSteps = 4;
  const toppingsPrice = Object.entries(toppingsCounts).reduce((acc, [id, count]) => {
      const topping = TOPPINGS.find(t => t.id === id);
      return acc + (topping ? topping.price * count : 0);
  }, 0);
  const totalInternal = pizza.price + selectedSize.priceMod + toppingsPrice;

  const updateToppingCount = (id: string, delta: number) => {
    setToppingsCounts(prev => ({
        ...prev,
        [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="relative w-full max-w-[750px] h-[90vh] bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
          >
            {/* 1. HERO IMAGE WITH OVERLAY */}
            <div className="relative h-[220px] w-full flex-shrink-0">
                <img src={pizza.imagePath ? `http://localhost:3002${pizza.imagePath}` : pizza.imageUrl} className="w-full h-full object-cover" alt={pizza.name} />
                <div className="absolute inset-0 bg-black/10" />
                
                <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white border border-white/10 z-30">
                    <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-8 flex items-end justify-between right-8">
                    <h2 className="text-4xl font-black uppercase text-white drop-shadow-md">{pizza.name}</h2>
                    <div className="bg-primary text-black px-5 py-2 rounded-xl font-black text-xl shadow-lg">
                        €{totalInternal.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* 2. BASE CONTENT AREA (SCROLLABLE) */}
            <div className="flex-grow overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
                
                <AnimatePresence mode="wait">
                    {/* STEP 1: SIZE */}
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h3 className="text-lg font-black uppercase text-white tracking-widest border-b border-white/5 pb-4">CHOISISSEZ VOTRE TAILLE</h3>
                            <div className="grid grid-cols-3 gap-6">
                                {SIZES.map((sz) => (
                                    <button 
                                        key={sz.id} 
                                        onClick={() => setSelectedSize(sz)}
                                        className={`relative p-8 rounded-3xl border transition-all flex flex-col items-center gap-2 ${selectedSize.id === sz.id ? 'border-primary bg-primary/5' : 'border-white/5 bg-[#222]'}`}
                                    >
                                        <span className="font-black uppercase text-xs text-white">{sz.name}</span>
                                        <span className="text-[10px] font-bold text-slate-500">{sz.desc}</span>
                                        {selectedSize.id === sz.id && <div className="absolute top-3 right-3 text-primary"><Check className="w-4 h-4" /></div>}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: TOPPINGS */}
                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <h3 className="text-lg font-black uppercase text-white tracking-widest">ENVIE DE SUPPLÉMENTS ?</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {TOPPINGS.map((t) => (
                                    <div key={t.id} className="bg-[#222] border border-white/5 rounded-3xl p-4 flex flex-col items-center gap-3">
                                        <div className="text-center">
                                            <span className="block text-[10px] font-black text-white uppercase">{t.name}</span>
                                            <span className="text-[9px] font-bold text-slate-500">+€{t.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-black/40 rounded-full p-1 border border-white/10">
                                            <button onClick={() => updateToppingCount(t.id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"><Minus className="w-3 h-3 text-slate-400" /></button>
                                            <span className="text-xs font-black text-white w-4 text-center">{toppingsCounts[t.id] || 0}</span>
                                            <button onClick={() => updateToppingCount(t.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-primary/20 text-primary transition-all"><Plus className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ... other steps ... */}
                </AnimatePresence>
            </div>

            {/* 3. FOOTER */}
            <div className="bg-[#1a1a1a] p-8 border-t border-white/5 space-y-6">
                <div className="flex gap-4">
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="px-8 py-5 bg-[#252525] border border-white/5 rounded-2xl flex items-center justify-center gap-2 text-white font-black text-xs hover:bg-[#333] transition-all uppercase">
                            <ChevronLeft className="w-4 h-4" /> RETOUR
                        </button>
                    )}
                    <button onClick={() => step < totalSteps ? setStep(step + 1) : onAddToCart({ pizza, selectedSize, toppingsCounts, price: totalInternal })} className="flex-grow py-5 bg-primary rounded-2xl flex items-center justify-center gap-3 text-black font-black text-xs hover:bg-[#cbd52a] transition-all uppercase">
                        {step === totalSteps ? "CONFIRMER L'AJOUT" : "SUIVANT"} <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
