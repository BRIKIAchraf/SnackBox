"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Zap, DollarSign, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ToppingsPage() {
  const [toppings, setToppings] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", price: "" });

  const fetchToppings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("https://api-production-48c5.up.railway.app/api/v1/toppings");
      setToppings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToppings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      await axios.post("https://api-production-48c5.up.railway.app/api/v1/toppings", {
        name: formData.name,
        price: parseFloat(formData.price),
        available: true
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setFormData({ name: "", price: "" });
      fetchToppings();
    } catch (e) { console.error(e); }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
      try {
          const token = localStorage.getItem("admin_token");
          await axios.patch(`https://api-production-48c5.up.railway.app/api/v1/toppings/${id}`, { available: !current }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchToppings();
      } catch (e) { console.error(e); }
  }

  const deleteTopping = async (id: string) => {
      if(!confirm("Supprimer cet ingrédient ?")) return;
      try {
          const token = localStorage.getItem("admin_token");
          await axios.delete(`https://api-production-48c5.up.railway.app/api/v1/toppings/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchToppings();
      } catch (e) { console.error(e); }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-primary">Gestion des Ingrédients</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Configurez les suppléments et garnitures disponibles.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(255,106,0,0.3)] hover:scale-105 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> AJOUTER UN INGRÉDIENT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {toppings.map((item) => (
                <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`stat-card group flex flex-col p-6 border border-white/5 hover:border-primary/20 transition-all ${!item.available ? 'opacity-50 grayscale-[0.5]' : ''}`}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                            <Zap className={`w-6 h-6 ${item.available ? 'text-primary' : 'text-slate-600'}`} />
                        </div>
                        <div className="flex gap-2">
                             <button 
                                onClick={() => toggleAvailability(item.id, item.available)}
                                className={`p-2 rounded-lg border transition-all ${item.available ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
                             >
                                <Activity className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => deleteTopping(item.id)}
                                className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all border border-white/5"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                        </div>
                    </div>

                    <div className="space-y-1 mb-6">
                        <h3 className="text-lg font-black uppercase italic tracking-tighter">{item.name}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{item.available ? 'Actif' : 'Désactivé'}</p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-primary">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xl font-black italic">{parseFloat(item.price).toFixed(2)}€</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Supplément</span>
                    </div>
                </motion.div>
            ))}
          </AnimatePresence>

          {toppings.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                  <p className="text-slate-500 font-bold italic uppercase tracking-widest">Aucun ingrédient configuré.</p>
              </div>
          )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-[#121215] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-white">Nouvel Ingrédient</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-widest">Nom de l'ingrédient</label>
                            <input required placeholder="ex: Fromage de Chèvre" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary/50 outline-none transition-all font-bold text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-widest">Prix du supplément (€)</label>
                            <input type="number" step="0.01" required placeholder="1.50" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary/50 outline-none transition-all font-bold text-sm" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                        </div>
                        <button className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase text-sm mt-4 shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all italic tracking-widest">CRÉER L'INGRÉDIENT</button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
