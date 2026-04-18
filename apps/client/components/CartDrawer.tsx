"use client";

import { useCartStore } from "../store/cart-store";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, CreditCard, Pizza, Truck, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, offers, removeItem, updateQuantity, removeOffer, updateOfferQuantity, getTotal } = useCartStore();
  const FREE_DELIVERY_THRESHOLD = 30;
  const total = getTotal();
  const progress = Math.min((total / FREE_DELIVERY_THRESHOLD) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/5 z-[101] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* HEADER */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="relative">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                    <motion.span 
                        key={items.length + offers.length}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-2 -right-2 bg-primary text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-black"
                    >
                        {items.length + offers.length}
                    </motion.span>
                </div>
                <h2 className="text-xl font-black italic uppercase italic tracking-widest text-white">VOTRE PANIER</h2>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* FREE DELIVERY PROGRESS */}
            <div className="px-10 py-6 bg-white/[0.02] border-b border-white/5">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                        {total >= FREE_DELIVERY_THRESHOLD ? "LIVRAISON OFFERTE !" : `Manque ${(FREE_DELIVERY_THRESHOLD - total).toFixed(2)}€ pour la livraison offerte`}
                    </span>
                    <Truck className={`w-4 h-4 ${total >= FREE_DELIVERY_THRESHOLD ? 'text-primary' : 'text-slate-600'}`} />
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary shadow-[0_0_10px_rgba(212,225,46,0.3)]"
                    />
                </div>
            </div>

            {/* ITEMS LIST */}
            <div className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar">
              {items.length === 0 && offers.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/5 relative">
                    <Pizza className="w-12 h-12 text-white/10" />
                    <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-spin-slow" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase text-white">VIDE...</h3>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">Osez le premier pas vers le délice.</p>
                  </div>
                  <button onClick={onClose} className="btn-primary !px-12">EXPLORER LE MENU</button>
                </div>
              ) : (
                <LayoutGroup>
                    <AnimatePresence>
                        {/* Render OFFERS first */}
                        {offers.map((offer) => (
                        <motion.div 
                            layout
                            key={offer.id} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="flex gap-6 group relative bg-primary/5 p-3 rounded-3xl border border-primary/20"
                        >
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5 p-1 border border-white/5 group-hover:border-primary/20 transition-all">
                                <Image src={offer.imageUrl || ""} alt={offer.name} fill sizes="96px" className="object-cover rounded-xl group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="flex-grow flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="pr-4">
                                        <span className="text-[8px] bg-primary text-white px-2 py-0.5 rounded uppercase font-black tracking-widest mb-1 inline-block">PACK</span>
                                        <h4 className="font-black text-xs uppercase tracking-tight text-primary leading-tight">{offer.name}</h4>
                                    </div>
                                    <button onClick={() => removeOffer(offer.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-sm font-black text-white italic">{offer.price.toFixed(2)}€</span>
                                    <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-1 border border-white/10">
                                        <button onClick={() => updateOfferQuantity(offer.id, offer.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-white"><Minus className="w-3 h-3" /></button>
                                        <span className="text-xs font-black w-4 text-center text-white">{offer.quantity}</span>
                                        <button onClick={() => updateOfferQuantity(offer.id, offer.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-white"><Plus className="w-3 h-3" /></button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        ))}

                        {/* Render ITEMS */}
                        {items.map((item) => (
                        <motion.div 
                            layout
                            key={item.id} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="flex gap-6 group relative"
                        >
                            <div className="relative w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 bg-white/5 p-1 border border-white/5 group-hover:border-primary/20 transition-all">
                                <Image src={item.imageUrl || ""} alt={item.name} fill sizes="96px" className="object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="flex-grow flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-black text-xs uppercase tracking-tight text-white leading-tight pr-4">{item.name}</h4>
                                    <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-sm font-black text-primary italic">{item.price.toFixed(2)}€</span>
                                    <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-1 border border-white/10">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-white"><Minus className="w-3 h-3" /></button>
                                        <span className="text-xs font-black w-4 text-center text-white">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-white"><Plus className="w-3 h-3" /></button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        ))}
                    </AnimatePresence>
                </LayoutGroup>
              )}
            </div>

            {/* FOOTER */}
            {items.length > 0 && (
              <div className="p-10 bg-[#0c0c0c] border-t border-white/5 space-y-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-xl font-black uppercase italic tracking-tighter text-white">TOTAL</span>
                    <span className="text-4xl font-black text-primary italic drop-shadow-glow">{(total).toFixed(2)}€</span>
                  </div>
                </div>

                <Link 
                    href="/checkout" 
                    onClick={onClose}
                    className="w-full btn-primary flex items-center justify-center gap-4 !h-20 !text-sm !rounded-3xl"
                >
                  VALIDER MA COMMANDE <ChevronRight className="w-6 h-6" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
