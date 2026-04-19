"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Plus, Minus, ShoppingBag, Pizza, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PizzaCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  pizza: any;
  toppings: any[];
  onAddToCart: (customized: any) => void;
}

const SIZES = [
    { id: 'junior', name: 'Junior', priceMod: 0, desc: 'Incl.' },
    { id: 'senior', name: 'Sénior', priceMod: 4.50, desc: '+€4.50' },
    { id: 'mega', name: 'Méga', priceMod: 10.00, desc: '+€10.00' }
];

export const PizzaCustomizer = ({ isOpen, onClose, pizza, toppings, onAddToCart }: PizzaCustomizerProps) => {
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
      const topping = toppings.find(t => t.id === id);
      return acc + (topping ? parseFloat(topping.price) * count : 0);
  }, 0);
  const totalInternal = parseFloat(pizza.price) + selectedSize.priceMod + toppingsPrice;

  const updateToppingCount = (id: string, delta: number) => {
    setToppingsCounts(prev => ({
        ...prev,
        [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[850px] h-[85vh] bg-[#121212] rounded-[3rem] overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.9)] border border-white/5"
          >
            {/* 1. HERO HEADER */}
            <div className="relative h-[280px] w-full flex-shrink-0 group">
                <img 
                    src={pizza.images && pizza.images.length > 0 ? pizza.images[0] : (pizza.imagePath ? `https://api-production-48c5.up.railway.app${pizza.imagePath}` : (pizza.imageUrl || "/placeholder-pizza.jpg"))} 
                    className="w-full h-full object-cover grayscale-[20%]" 
                    alt={pizza.name} 
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#121212] to-transparent" />
                
                <button 
                    onClick={onClose} 
                    className="absolute top-8 right-8 w-12 h-12 bg-black/60 rounded-full flex items-center justify-center text-white border border-white/10 z-30 hover:bg-white hover:text-black transition-all"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="absolute bottom-10 left-10 flex items-end justify-between right-10">
                    <div>
                        <h2 className="text-5xl font-black uppercase text-white tracking-tighter italic">{pizza.name}</h2>
                        <div className="flex gap-2 mt-2">
                            {pizza.description?.split(',').map((ing: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-bold text-slate-400 uppercase">{ing.trim()}</span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-primary text-black px-8 py-3 rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(255,106,0,0.3)] italic">
                        €{totalInternal.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* 2. PROGRESS BAR */}
            <div className="px-10 py-4 flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Étape {step} / {totalSteps}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        className="h-full bg-primary"
                    />
                </div>
            </div>

            {/* 3. CONTENT AREA */}
            <div className="flex-grow overflow-y-auto px-10 py-4 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="s1" 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h3 className="text-3xl font-black uppercase text-white tracking-widest italic mb-8">CHOISISSEZ VOTRE TAILLE</h3>
                            <div className="grid grid-cols-3 gap-6">
                                {SIZES.map((sz) => (
                                    <button 
                                        key={sz.id} 
                                        onClick={() => setSelectedSize(sz)}
                                        className={`relative p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 group ${selectedSize.id === sz.id ? 'border-primary bg-primary/5' : 'border-white/5 bg-[#1a1a1a] hover:bg-[#222]'}`}
                                    >
                                        <Pizza className={`w-12 h-12 ${selectedSize.id === sz.id ? 'text-primary' : 'text-slate-700'} transition-colors`} />
                                        <div className="text-center">
                                            <span className="block font-black uppercase text-sm text-white">{sz.name}</span>
                                            <span className="text-[10px] font-bold text-slate-500 mt-1">{sz.desc}</span>
                                        </div>
                                        {selectedSize.id === sz.id && <div className="absolute top-5 right-5 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black"><Check className="w-3.5 h-3.5" /></div>}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="s2" 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-between items-end mb-8">
                                <h3 className="text-3xl font-black uppercase text-white tracking-widest italic">ENVIE DE SUPPLÉMENTS ?</h3>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Jusqu'à 5</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {toppings.map((t) => (
                                    <div key={t.id} className="bg-[#1a1a1a] border border-white/5 rounded-[2rem] p-6 flex flex-col items-center gap-4 group hover:border-white/10 transition-all">
                                        <div className="w-16 h-16 relative bg-black/40 rounded-2xl p-2 flex items-center justify-center border border-white/5">
                                            <img src={t.imageUrl || "/topping.png"} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" alt={t.name} />
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-[11px] font-black text-white uppercase tracking-tight">{t.name}</span>
                                            <span className="text-[10px] font-bold text-primary mt-1 block">+{parseFloat(t.price).toFixed(2)}€</span>
                                        </div>
                                        <div className="flex items-center gap-4 bg-black/60 rounded-full p-1.5 border border-white/10">
                                            <button 
                                                onClick={() => updateToppingCount(t.id, -1)} 
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-xs font-black text-white w-4 text-center">{(toppingsCounts[t.id] || 0)}</span>
                                            <button 
                                                onClick={() => updateToppingCount(t.id, 1)} 
                                                disabled={(toppingsCounts[t.id] || 0) >= 5}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all disabled:opacity-30"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 4. FOOTER OPTIONS */}
            <div className="bg-[#0c0c0c] p-10 border-t border-white/5">
                <div className="flex gap-4">
                    {step > 1 && (
                        <button 
                            onClick={() => setStep(step - 1)} 
                            className="px-10 py-5 bg-[#1a1a1a] border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-slate-400 font-black text-xs hover:text-white hover:bg-[#222] transition-all uppercase"
                        >
                            <ChevronLeft className="w-5 h-5" /> RETOUR
                        </button>
                    )}
                    <button 
                        onClick={() => step < 2 ? setStep(step + 1) : onAddToCart({ pizza, selectedSize, toppingsCounts, price: totalInternal })} 
                        className="flex-grow py-5 bg-primary rounded-2xl flex items-center justify-center gap-4 text-black font-black text-sm hover:scale-[1.02] active:scale-95 transition-all uppercase shadow-[0_15px_30px_rgba(255,106,0,0.2)]"
                    >
                        {step === 2 ? "CONFIRMER L'AJOUT AU PANIER" : "CONTINUER LA CONFIGURATION"} 
                        {step < 2 ? <ChevronRight className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                    </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
