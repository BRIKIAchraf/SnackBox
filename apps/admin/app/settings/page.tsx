"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Save, Store, Clock, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get("https://api-production-48c5.up.railway.app/api/v1/settings");
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch("https://api-production-48c5.up.railway.app/api/v1/settings", settings);
      alert("Settings saved successfully!");
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="p-20 text-center text-slate-500 font-black italic uppercase tracking-widest animate-pulse">Loading system configuration...</div>;

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-primary">System Configuration</h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Control the global state of your platform.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">
        <section className="stat-card !p-8 space-y-8 group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-4 text-primary mb-2">
                <Store className="w-6 h-6" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter">General Identity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase pl-1">Restaurant Name</label>
                    <input 
                        value={settings.restaurantName}
                        onChange={e => setSettings({...settings, restaurantName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-primary/50 outline-none transition-colors font-bold text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase pl-1">Support Email</label>
                    <input 
                        value={settings.contactEmail}
                        onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-primary/50 outline-none transition-colors font-bold text-sm"
                    />
                </div>
            </div>
        </section>

        <section className="stat-card !p-8 space-y-8 group hover:border-orange-500/20 transition-all">
            <div className="flex items-center gap-4 text-orange-500 mb-2">
                <Clock className="w-6 h-6" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Operational Logistics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase pl-1">Min Order (€)</label>
                    <input 
                        type="number"
                        value={settings.minOrderValue}
                        onChange={e => setSettings({...settings, minOrderValue: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-black text-sm outline-none focus:border-primary/50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase pl-1">Prep Time (min)</label>
                    <input 
                        type="number"
                        value={settings.preparationTime}
                        onChange={e => setSettings({...settings, preparationTime: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-black text-sm outline-none focus:border-primary/50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase pl-1">Delivery Time (min)</label>
                    <input 
                        type="number"
                        value={settings.deliveryTime}
                        onChange={e => setSettings({...settings, deliveryTime: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-black text-sm outline-none focus:border-primary/50"
                    />
                </div>
            </div>
        </section>

        <section className="stat-card !p-8 flex items-center justify-between group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border border-transparent ${settings.isOpen ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                    <Store className="w-7 h-7" />
                </div>
                <div>
                    <h4 className="font-black italic uppercase tracking-tighter text-lg text-white">Restaurant Status</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{settings.isOpen ? 'Accepting orders' : 'Currently closed'}</p>
                </div>
            </div>
            <button 
                type="button"
                onClick={() => setSettings({...settings, isOpen: !settings.isOpen})}
                className={`w-16 h-8 rounded-full flex items-center px-1.5 transition-all shadow-inner ${settings.isOpen ? 'bg-green-600 shadow-green-900/50' : 'bg-slate-700 shadow-black/50'}`}
            >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform shadow-lg ${settings.isOpen ? 'translate-x-8' : 'translate-x-0'}`} />
            </button>
        </section>

        <div className="flex justify-end pt-6">
            <button type="submit" className="px-16 py-5 bg-primary text-white rounded-2xl font-black flex items-center gap-3 hover:bg-primary-hover transition-all shadow-2xl text-sm uppercase italic tracking-widest active:scale-95">
                <Save className="w-5 h-5" /> Save Configuration
            </button>
        </div>
      </form>
    </div>
  );
}
