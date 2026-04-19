"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Utensils, ShoppingBag, Truck, MapPin, ChevronRight } from "lucide-react";

interface OrderModeModalProps {
    isOpen: boolean;
    onSelect: (mode: 'DELIVERY' | 'TAKEAWAY' | 'ONSITE') => void;
}

export const OrderModeModal = ({ isOpen, onSelect }: OrderModeModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-[550px] bg-[#121212] rounded-[3.5rem] p-12 border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.9)] text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
                        
                        <div className="mb-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
                                <ShoppingBag className="w-8 h-8 text-primary shadow-glow" />
                            </div>
                            <h2 className="text-3xl font-black uppercase italic text-white tracking-widest leading-none">COMMENT SOUHAITEZ-VOUS COMMANDER ?</h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4 opacity-60">Sélectionnez votre mode de commande pour voir notre menu.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: 'ONSITE', label: 'SUR PLACE', icon: Utensils },
                                { id: 'TAKEAWAY', label: 'À EMPORTER', icon: ShoppingBag },
                                { id: 'DELIVERY', label: 'EN LIVRAISON', icon: Truck },
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => onSelect(mode.id as any)}
                                    className="w-full group relative p-6 bg-white/5 border border-white/5 rounded-[2rem] flex items-center gap-6 hover:bg-white/10 hover:border-white/10 transition-all text-left"
                                >
                                    <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <mode.icon className="w-6 h-6 text-slate-400 group-hover:text-black" />
                                    </div>
                                    <div className="flex-grow">
                                        <span className="block text-sm font-black text-white uppercase tracking-widest letter-spacing-1">{mode.label}</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 p-6 bg-primary/5 rounded-[2rem] border border-white/5 flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">POINT DE RETRAIT PRINCIPAL</span>
                                <span className="block text-[10px] font-bold text-white uppercase tracking-tight">15 Rue de la Paix, Paris, 75001</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
