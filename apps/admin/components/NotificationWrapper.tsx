"use client";

import { useNotifications } from "../hooks/useNotifications";
import { Bell, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const NotificationWrapper = ({ children }: { children: React.ReactNode }) => {
    const { latestOrder, setLatestOrder } = useNotifications();

    return (
        <>
            {children}
            <AnimatePresence>
                {latestOrder && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="fixed bottom-10 right-10 z-[200] w-96 glass-card p-6 border-primary/50 shadow-[0_0_50px_rgba(255,106,0,0.2)]"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-primary/40">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-black italic uppercase text-sm tracking-widest text-primary">New Order Incoming</h4>
                                    <button onClick={() => setLatestOrder(null)} className="text-white/20 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                                </div>
                                <p className="text-lg font-black italic mt-1 uppercase tracking-tighter text-white">Order #{latestOrder.id.slice(0,8).toUpperCase()}</p>
                                <p className="text-xs text-white/40 mt-1 font-bold">Total Val: <span className="text-white">{parseFloat(latestOrder.total).toFixed(2)}€</span></p>
                                <div className="flex gap-2 mt-5">
                                    <button className="flex-grow py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all">View Analytics</button>
                                    <button onClick={() => setLatestOrder(null)} className="px-4 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Dismiss</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
