"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Eye, RefreshCcw, MoreHorizontal, X, User, MapPin, Phone, Clock, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_MAP: Record<string, { label: string, color: string }> = {
  PENDING_PAYMENT: { label: "En attente de paiement", color: "bg-orange-500/20 text-orange-400 border-orange-500/20" },
  PAID: { label: "Payé", color: "bg-primary/20 text-primary border-primary/20" },
  CONFIRMED: { label: "Confirmé", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/20" },
  PREPARING: { label: "En préparation", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20" },
  BAKING: { label: "Au four", color: "bg-orange-500/20 text-orange-400 border-orange-500/20" },
  READY: { label: "Prêt", color: "bg-green-500/20 text-green-400 border-green-500/20" },
  DELIVERING: { label: "En livraison", color: "bg-purple-500/20 text-purple-400 border-purple-500/20" },
  DELIVERED: { label: "Livré", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [userTypeFilter, setUserTypeFilter] = useState<'ALL' | 'REGISTERED' | 'GUEST'>('ALL');
  const [converting, setConverting] = useState(false);
  const [convertEmail, setConvertEmail] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("https://api-production-48c5.up.railway.app/api/v1/orders");
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
      try {
          await axios.patch(`https://api-production-48c5.up.railway.app/api/v1/orders/${id}/status`, { status });
          fetchOrders();
      } catch (e) { console.error(e); }
  }

  const convertGuest = async () => {
    if (!selectedOrder || !convertEmail) return;
    setConverting(true);
    try {
        const token = localStorage.getItem("admin_token");
        await axios.post(
            `https://api-production-48c5.up.railway.app/api/v1/users/convert-guest`, 
            { orderId: selectedOrder.id, email: convertEmail, phone: selectedOrder.customerPhone },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Compte créé avec succès ! Le mot de passe a été généré.");
        setSelectedOrder(null);
        fetchOrders();
    } catch (e: any) {
        alert(e.response?.data?.message || "Erreur lors de la conversion");
    } finally {
        setConverting(false);
        setConvertEmail("");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
      userTypeFilter === 'ALL' || o.userType === userTypeFilter
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Gestion des Commandes</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Suivez et gérez les commandes clients en temps réel.</p>
        </div>
        <button onClick={fetchOrders} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin text-primary' : ''}`} />
        </button>
      </div>

      <div className="flex gap-4 items-center">
          <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                  type="text" 
                  placeholder="Rechercher par ID ou client..." 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-primary/50 transition-colors font-bold text-sm" 
              />
          </div>
          <div className="flex bg-white/5 border border-white/5 rounded-2xl p-1">
              <button onClick={() => setUserTypeFilter('ALL')} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${userTypeFilter === 'ALL' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>Tous</button>
              <button onClick={() => setUserTypeFilter('REGISTERED')} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${userTypeFilter === 'REGISTERED' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>Inscrits</button>
              <button onClick={() => setUserTypeFilter('GUEST')} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${userTypeFilter === 'GUEST' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>Invités</button>
          </div>
      </div>

      <div className="stat-card overflow-hidden !p-0">
          <table className="admin-table">
              <thead>
                  <tr>
                      <th>ID Commande</th>
                      <th>Articles</th>
                      <th>Total</th>
                      <th>Statut</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-20 text-slate-500 font-bold italic">Aucune commande trouvée pour ce filtre.</td>
                      </tr>
                  ) : filteredOrders.map((order) => (
                    <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <td className="font-mono text-xs text-primary font-bold">#{order.id.slice(0, 8).toUpperCase()}</td>
                        <td>
                            <div className="flex flex-col gap-1">
                                {order.offers && order.offers.map((offer: any) => (
                                    <span key={`offer-${offer.id}`} className="text-sm font-black text-primary">
                                        <span className="text-[10px] px-1 bg-primary text-white rounded mr-1">PACK</span>
                                        {offer.quantity}x {offer.name}
                                    </span>
                                ))}
                                {order.items?.map((item: any) => (
                                    <span key={`item-${item.id}`} className="text-sm font-semibold text-slate-300">
                                        {item.quantity}x {item.product?.name || item.name}
                                    </span>
                                ))}
                            </div>
                        </td>
                        <td className="font-black">{parseFloat(order.total).toFixed(2)}€</td>
                        <td>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${STATUS_MAP[order.status]?.color || 'bg-slate-500/20 text-slate-400 border-slate-500/20'}`}>
                                {STATUS_MAP[order.status]?.label || order.status}
                            </span>
                        </td>
                        <td>
                            <div className="flex items-center gap-2">
                                <select 
                                    className="bg-black border border-white/10 rounded-lg py-1 px-2 text-[10px] font-black outline-none cursor-pointer focus:border-primary/50"
                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                    value={order.status}
                                >
                                    {Object.keys(STATUS_MAP).map(k => <option key={k} value={k}>{STATUS_MAP[k].label}</option>)}
                                </select>
                                <button 
                                    onClick={() => setSelectedOrder(order)}
                                    className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all border border-white/5"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        </td>
                    </motion.tr>
                  ))}
              </tbody>
          </table>
      </div>

      <AnimatePresence>
          {selectedOrder && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.95, opacity: 0 }} 
                    className="relative w-full max-w-2xl bg-[#121215] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                  >
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Détails de la Commande</h2>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">#{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X /></button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-8">
                                <section className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-3 h-3" /> Infos Client
                                        <span className={`px-2 py-0.5 rounded text-[8px] ${selectedOrder.userType === 'REGISTERED' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                            {selectedOrder.userType === 'REGISTERED' ? 'COMPTE' : 'INVITÉ'}
                                        </span>
                                    </h4>
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                                        <div>
                                            <p className="font-black text-sm">{selectedOrder.customerName}</p>
                                            <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-1"><Phone className="w-3 h-3" /> {selectedOrder.customerPhone || "N/A"}</p>
                                        </div>
                                        {selectedOrder.userType === 'GUEST' && (
                                            <div className="pt-3 border-t border-white/10 space-y-2">
                                                <p className="text-[10px] font-bold text-primary uppercase">Convertir en client inscrit</p>
                                                <input 
                                                    type="email"
                                                    placeholder="Email pour le compte"
                                                    value={convertEmail}
                                                    onChange={e => setConvertEmail(e.target.value)}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-xs text-white placeholder-slate-500 outline-none focus:border-primary/50"
                                                />
                                                <button 
                                                    onClick={convertGuest} 
                                                    disabled={converting || !convertEmail}
                                                    className="w-full bg-primary/20 hover:bg-primary text-primary hover:text-white transition-all rounded-xl p-2 text-[10px] font-black uppercase disabled:opacity-50"
                                                >
                                                    {converting ? "Conversion..." : "Créer un compte"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-3 h-3" /> Adresse de Livraison
                                    </h4>
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2">
                                        <p className="text-xs font-bold text-slate-300">{selectedOrder.address}</p>
                                        {selectedOrder.instructions && (
                                            <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl">
                                                <p className="text-[10px] font-black text-primary uppercase mb-1 flex items-center gap-1"><FileText className="w-3 h-3" /> Instructions</p>
                                                <p className="text-xs italic text-slate-300">{selectedOrder.instructions}</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>

                            <section className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contenu de la Commande</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center font-black text-primary">{item.quantity}x</div>
                                                <div>
                                                    <p className="font-black uppercase italic text-sm">{item.product?.name || item.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-500">{item.price.toFixed(2)}€ / unité</p>
                                                </div>
                                            </div>
                                            <p className="font-black text-sm">{(item.quantity * item.price).toFixed(2)}€</p>
                                        </div>
                                    ))}

                                    {/* Section spéciale pour les Packs (Offres) */}
                                    {selectedOrder.offers && selectedOrder.offers.map((offer: any) => {
                                        let parsedOptions: string[] = [];
                                        try {
                                            parsedOptions = JSON.parse(offer.options || "[]");
                                        } catch (e) {}
                                        return (
                                        <div key={offer.id} className="flex flex-col p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl border border-primary/20">
                                            <div className="flex justify-between items-center w-full">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-black">{offer.quantity}x</div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase rounded">PACK</span>
                                                            <p className="font-black uppercase italic text-sm text-white">{offer.name}</p>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-500 mt-1">{offer.price.toFixed(2)}€ / unité</p>
                                                    </div>
                                                </div>
                                                <p className="font-black text-sm text-primary">{(offer.quantity * offer.price).toFixed(2)}€</p>
                                            </div>
                                            {parsedOptions.length > 0 && (
                                                <div className="mt-4 pl-14 space-y-1">
                                                    {parsedOptions.map((opt, i) => (
                                                        <p key={i} className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                                            <span className="w-1 h-1 rounded-full bg-primary" /> {opt}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )})}
                                </div>
                            </section>
                        </div>

                        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-between items-center mt-auto">
                            <div className="flex items-center gap-4">
                                <Clock className="w-5 h-5 text-slate-500" />
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Créée le : {new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Général</p>
                                <p className="text-3xl font-black text-primary italic">{parseFloat(selectedOrder.total).toFixed(2)}€</p>
                            </div>
                        </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </div>
  );
}
