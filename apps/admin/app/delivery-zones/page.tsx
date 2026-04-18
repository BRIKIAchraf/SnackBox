"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, MapPin, Trash2, Power, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminZonesPage() {
    const [zones, setZones] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", fee: "", minOrder: "", estimatedTime: "" });

    const fetchZones = async () => {
        try {
            const { data } = await axios.get("https://api-production-48c5.up.railway.app/api/v1/delivery-zones");
            setZones(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchZones();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("https://api-production-48c5.up.railway.app/api/v1/delivery-zones", {
                name: formData.name,
                fee: parseFloat(formData.fee),
                minOrder: parseFloat(formData.minOrder),
                estimatedTime: parseInt(formData.estimatedTime),
                isActive: true
            });
            setIsModalOpen(false);
            setFormData({ name: "", fee: "", minOrder: "", estimatedTime: "" });
            fetchZones();
        } catch (e) { console.error(e); }
    };

    const toggleZone = async (id: string, current: boolean) => {
        try {
            await axios.patch(`https://api-production-48c5.up.railway.app/api/v1/delivery-zones/${id}`, { isActive: !current });
            fetchZones();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-primary">Delivery Zones</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Manage Coverage and Fees.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-primary-hover transition-all group active:scale-95">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> CREATE ZONE
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map((zone) => (
                    <motion.div 
                        key={zone.id}
                        className={`stat-card relative overflow-hidden group hover:border-primary/30 transition-all ${!zone.isActive ? 'opacity-60 grayscale-[0.5]' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-xl ${zone.isActive ? 'bg-primary/10 text-primary' : 'bg-slate-500/10 text-slate-500'}`}>
                                <MapPin className="w-6 h-6" />
                            </div>
                            <button 
                                onClick={() => toggleZone(zone.id, zone.isActive)}
                                className={`p-2 rounded-lg transition-colors ${zone.isActive ? 'text-green-500 hover:bg-green-500/10' : 'text-slate-500 hover:bg-slate-500/10'}`}
                            >
                                <Power className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">{zone.name}</h3>
                        
                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
                                <span>FEE</span>
                                <span className="text-white">{parseFloat(zone.fee).toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
                                <span>MIN ORDER</span>
                                <span className="text-white">{parseFloat(zone.minOrder).toFixed(2)}€</span>
                            </div>
                        </div>

                        <button 
                            onClick={async () => {
                                if(confirm("Delete zone?")) {
                                    await axios.delete(`https://api-production-48c5.up.railway.app/api/v1/delivery-zones/${zone.id}`);
                                    fetchZones();
                                }
                            }}
                            className="w-full py-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                            DELETE ZONE
                        </button>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-[#121215] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Create Zone</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Zone Name</label>
                                    <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 font-bold text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Fee (€)</label>
                                        <input type="number" step="0.5" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 font-bold text-sm" value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Min Order (€)</label>
                                        <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 font-bold text-sm" value={formData.minOrder} onChange={e => setFormData({...formData, minOrder: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Est. Time (min)</label>
                                    <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 font-bold text-sm" value={formData.estimatedTime} onChange={e => setFormData({...formData, estimatedTime: e.target.value})} />
                                </div>
                                <button className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase text-sm italic tracking-widest shadow-xl hover:bg-primary-hover transition-all mt-4">CREATE ZONE</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
