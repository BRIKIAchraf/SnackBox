"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ShoppingBag, Gift, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface OfferCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  offer: any;
  onAddOfferToCart: (customizedOffer: any) => void;
}

const DRINKS = [
    { id: 'coca', name: 'Coca Cola 33cl', price: 0 },
    { id: 'fanta', name: 'Fanta Orange 33cl', price: 0 },
    { id: 'sprite', name: 'Sprite 33cl', price: 0 },
    { id: 'oasis', name: 'Oasis Tropical 33cl', price: 0},
    { id: 'redbull', name: 'RedBull', price: 2.50} // Premium drink adds cost
];

const EXTRAS = [
    { id: 'cheddar', name: 'Sauce Fromagère Supplémentaire', price: 1.00 },
    { id: 'meat', name: 'Double Viande', price: 2.50 },
    { id: 'fries', name: 'Grande Portion de Frites', price: 1.50 }
];

export const OfferCustomizer = ({ isOpen, onClose, offer, onAddOfferToCart }: OfferCustomizerProps) => {
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
        setSelectedDrinks([]);
        setSelectedExtras([]);
    }
  }, [isOpen]);

  if (!offer) return null;

  // Calculate customized total
  let extraPrice = 0;
  
  selectedDrinks.forEach(did => {
      const d = DRINKS.find(x => x.id === did);
      if (d) extraPrice += d.price;
  });
  
  selectedExtras.forEach(eid => {
      const e = EXTRAS.find(x => x.id === eid);
      if (e) extraPrice += e.price;
  });

  const totalPrice = offer.price + extraPrice;

  const handleConfirm = () => {
      const optionsStr = [
          ...selectedDrinks.map(did => `Boisson: ${DRINKS.find(d => d.id === did)?.name}`),
          ...selectedExtras.map(eid => `Extra: ${EXTRAS.find(e => e.id === eid)?.name}`)
      ];

      onAddOfferToCart({
          id: `${offer.id}-${Date.now()}`, // unique instance id for cart
          offerId: offer.id,
          name: offer.name,
          price: totalPrice,
          quantity: 1,
          imageUrl: offer.imagePath ? `https://api-production-48c5.up.railway.app${offer.imagePath}` : offer.imageUrl,
          customOptions: optionsStr
      });
      onClose();
  };

  const toggleDrink = (id: string) => {
      setSelectedDrinks(prev => 
          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
  };

  const toggleExtra = (id: string) => {
      setSelectedExtras(prev => 
          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="relative w-full max-w-[750px] max-h-[90vh] bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
          >
            {/* 1. HERO IMAGE WITH OVERLAY */}
            <div className="relative h-[220px] w-full flex-shrink-0">
                <img src={offer.imagePath ? `https://api-production-48c5.up.railway.app${offer.imagePath}` : offer.imageUrl} className="w-full h-full object-cover" alt={offer.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-black/10" />
                
                <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white border border-white/10 z-30">
                    <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-8 flex items-end gap-3 right-8">
                    <Gift className="w-8 h-8 text-primary shadow-2xl" />
                    <h2 className="text-4xl font-black uppercase text-white drop-shadow-md tracking-tighter">{offer.name}</h2>
                </div>
            </div>

            {/* 2. BASE CONTENT AREA (SCROLLABLE) */}
            <div className="flex-grow overflow-y-auto px-8 py-6 space-y-10 custom-scrollbar">
                <p className="text-sm font-bold text-slate-400 italic bg-white/5 p-4 rounded-xl border border-white/5">{offer.description}</p>
                
                {/* DRINKS SECTION */}
                <section className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <div>
                            <h3 className="text-lg font-black uppercase text-white tracking-widest">Choix de Boisson</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inclus dans le pack ou avec suppléments</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {DRINKS.map(drink => (
                            <button 
                                key={drink.id}
                                onClick={() => toggleDrink(drink.id)}
                                className={`relative p-4 rounded-2xl border text-left transition-all ${selectedDrinks.includes(drink.id) ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(255,106,0,0.2)]' : 'bg-[#222] border-white/5 hover:bg-[#2a2a2a]'}`}
                            >
                                <span className="block text-xs font-black text-white uppercase pr-6">{drink.name}</span>
                                <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                                    {drink.price === 0 ? 'Inclus' : `+€${drink.price.toFixed(2)}`}
                                </span>
                                {selectedDrinks.includes(drink.id) && (
                                    <div className="absolute top-4 right-4 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-black">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* EXTRAS SECTION */}
                <section className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <div>
                            <h3 className="text-lg font-black uppercase text-white tracking-widest">Gourmandise Extra</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Personnalisez votre pack</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {EXTRAS.map(extra => (
                            <button 
                                key={extra.id}
                                onClick={() => toggleExtra(extra.id)}
                                className={`relative p-4 rounded-2xl border text-left transition-all flex justify-between items-center ${selectedExtras.includes(extra.id) ? 'bg-primary/10 border-primary' : 'bg-[#222] border-white/5 hover:bg-[#2a2a2a]'}`}
                            >
                                <div>
                                    <span className="block text-xs font-black text-white uppercase">{extra.name}</span>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1 block">+€{extra.price.toFixed(2)}</span>
                                </div>
                                {selectedExtras.includes(extra.id) && <Check className="w-5 h-5 text-primary" />}
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            {/* 3. FOOTER */}
            <div className="bg-[#151515] p-6 md:p-8 border-t border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Pack</p>
                        <p className="text-4xl font-black italic text-primary">€{totalPrice.toFixed(2)}</p>
                    </div>
                    <button 
                        onClick={handleConfirm} 
                        className="px-8 py-5 bg-gradient-to-r from-primary to-orange-500 rounded-2xl flex items-center justify-center gap-3 text-black font-black text-xs hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,106,0,0.3)] transition-all uppercase"
                    >
                        <ShoppingBag className="w-5 h-5" /> Ajouter au panier
                    </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
