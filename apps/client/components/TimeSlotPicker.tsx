"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Check } from "lucide-react";

interface TimeSlotPickerProps {
    onSelect: (slot: string | null) => void;
}

export const TimeSlotPicker = ({ onSelect }: TimeSlotPickerProps) => {
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const date = new Date().toISOString().split('T')[0];
                const res = await axios.get(`https://api-production-48c5.up.railway.app/api/v1/scheduling/slots?date=${date}`);
                setSlots(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, []);

    const handleSelect = (slot: string | null) => {
        setSelectedSlot(slot);
        onSelect(slot);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-black uppercase italic text-white tracking-widest">CRÉNEAU DE LIVRAISON</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                    onClick={() => handleSelect(null)}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${selectedSlot === null ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                >
                    <span className="text-xs font-black text-white italic">DÈS QUE POSSIBLE</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Estimé: 35-45 min</span>
                </button>

                {slots.map((slot) => (
                    <button
                        key={slot}
                        onClick={() => handleSelect(slot)}
                        className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 relative ${selectedSlot === slot ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                    >
                        <span className="text-sm font-black text-white">{slot}</span>
                        {selectedSlot === slot && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-black">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center p-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};
