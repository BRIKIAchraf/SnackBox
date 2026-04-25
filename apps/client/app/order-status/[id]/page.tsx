"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../../../components/Navbar";
import { motion } from "framer-motion";
import { Check, Pizza, ChefHat, Truck, Home, MapPin, Clock, Phone } from "lucide-react";
import { useParams } from "next/navigation";
import { socket } from "../../../lib/socket";

export default function OrderStatusPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const statuses = [
        { key: 'PENDING', label: 'Reçue', icon: Check },
        { key: 'PREPARING', label: 'En préparation', icon: ChefHat },
        { key: 'COOKING', label: 'Au four', icon: Pizza },
        { key: 'DELIVERING', label: 'En livraison', icon: Truck },
        { key: 'DELIVERED', label: 'Bon appétit !', icon: Home }
    ];

    const currentStep = statuses.findIndex(s => s.key === order?.status) || 0;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`https://api-production-48c5.up.railway.app/api/v1/orders/${id}`);
                setOrder(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };

        fetchOrder();

        // Join the specific room for this order to receive targeted updates
        socket.emit('join_order', id);

        // Safety Polling Fallback (every 30s)
        const pollInterval = setInterval(fetchOrder, 30000);

        socket.on('order_status_updated', (data: any) => {
            if (data.orderId === id) {
                setOrder((prev: any) => ({ ...prev, status: data.status }));
            }
        });

        return () => { 
            socket.off('order_status_updated'); 
            clearInterval(pollInterval);
        };
    }, [id]);

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-primary uppercase tracking-widest text-3xl italic">Localisation de votre Boîte...</div>;
    if (!order) return <div className="p-40 text-center font-black text-white uppercase italic text-3xl">Commande non trouvée.</div>;

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 container mx-auto bg-[#050505] text-white">
            <Navbar />
            
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-8">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] italic">
                        Suivi en temps réel activé
                    </div>
                    <h1 className="text-6xl md:text-[8rem] font-black italic uppercase italic tracking-tighter leading-none">OÙ EST MA <br/> <span className="text-primary">BOÎTE ?</span></h1>
                </div>

                <div className="glass-card !p-12 !rounded-[3rem] relative overflow-hidden bg-white/5 border border-white/10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}
                            className="h-full bg-primary shadow-[0_0_20px_rgba(255,102,0,0.5)]"
                        />
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                        {statuses.map((s, i) => {
                            const Icon = s.icon;
                            const isActive = i <= currentStep;
                            const isCurrent = i === currentStep;

                            return (
                                <div key={s.key} className="flex flex-col items-center text-center gap-4">
                                    <motion.div 
                                        animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-primary text-black' : 'bg-white/5 text-slate-600'}`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </motion.div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-600'}`}>{s.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card !rounded-[2rem] p-10 space-y-6 bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-3">
                            <MapPin className="text-primary w-5 h-5" />
                            <h4 className="font-black uppercase italic tracking-widest text-white">Détails de livraison</h4>
                        </div>
                        <p className="text-slate-400 font-bold">{order.address}</p>
                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
                            <Clock className="w-4 h-4" /> Est. 30-40 mins
                        </div>
                    </div>

                    <div className="glass-card !rounded-[2rem] p-10 space-y-6 bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-3">
                            <Phone className="text-primary w-5 h-5" />
                            <h4 className="font-black uppercase italic tracking-widest text-white">Besoin d'aide ?</h4>
                        </div>
                        <p className="text-slate-400 font-bold">Appelez le restaurant directement pour toute demande spéciale.</p>
                        <a href="tel:0643454235" className="text-2xl font-black text-primary transition-opacity hover:opacity-80">06 43 45 42 35</a>
                    </div>
                </div>
            </div>
        </main>
    );
}
