"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Calendar, Clock, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface StoreClosedModalProps {
    isOpen: boolean;
    onSelectSlot: (slot: string) => void;
}

export const StoreClosedModal = ({ isOpen, onSelectSlot }: StoreClosedModalProps) => {
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const date = new Date().toISOString().split('T')[0];
            axios.get(`https://api-production-48c5.up.railway.app/api/v1/scheduling/slots?date=${date}`).then(res => {
                setSlots(res.data);
            });
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="w-full max-w-[500px] bg-[#121212] rounded-[3.5rem] p-12 border border-white/5 shadow-2xl text-center"
                    >
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
                                <Moon className="w-10 h-10 text-primary shadow-glow" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-[#121212]" />
                            </div>
                            <h2 className="text-4xl font-black uppercase italic text-white tracking-tighter mb-2">NOUS SOMMES FERMÉS</h2>
                            <p className="text-slate-500 text-xs font-medium max-w-[300px] leading-relaxed">Pas de panique ! Réservez votre créneau et on s'occupe du reste dès la réouverture.</p>
                        </div>

                        <div className="flex gap-2 justify-center mb-8">
                             <div className="px-5 py-2 bg-white/5 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">Aujourd'hui</div>
                             <div className="px-5 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">Demain</div>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-10">
                            {slots.slice(0, 12).map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`py-4 rounded-2xl border transition-all text-[11px] font-black ${selectedSlot === slot ? 'bg-primary text-black border-primary shadow-[0_10px_20px_rgba(255,106,0,0.3)]' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/10'}`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>

                        <button 
                            disabled={!selectedSlot}
                            onClick={() => selectedSlot && onSelectSlot(selectedSlot)}
                            className="w-full py-6 bg-primary rounded-[2rem] text-black font-black uppercase tracking-widest text-sm italic hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 shadow-[0_20px_40px_rgba(255,106,0,0.2)]"
                        >
                            CONFIRMER LE CRÉNEAU <ChevronRight className="inline w-5 h-5 ml-2" />
                        </button>
                        
                        <button className="mt-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-white transition-colors">VOIR LE MENU</button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
