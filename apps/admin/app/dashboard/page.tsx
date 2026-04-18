"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, Users, DollarSign, Activity, TrendingUp, TrendingDown, Pizza, MessageSquare, Utensils } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    customersCount: 0, // Mocked for now
    activePrep: 0,
    bestSeller: "Loading..."
  });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const { data } = await axios.get("http://localhost:3002/api/v1/orders/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats({
        revenue: data.totalRevenue,
        ordersCount: data.orderCount,
        customersCount: data.customerCount,
        activePrep: data.activeOrders,
        bestSeller: data.bestSeller
      });
    } catch (e: any) {
      console.error(e);
      if (e.response?.status === 401) {
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const STAT_CARDS = [
    { label: "Revenu Total", value: `${stats.revenue.toFixed(2)}€`, icon: DollarSign, trend: "+12.4%", color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Total Commandes", value: stats.ordersCount.toString(), icon: ShoppingBag, trend: "+45", color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Nouveaux Clients", value: stats.customersCount.toString(), icon: Users, trend: "+5", color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "En Cuisine", value: stats.activePrep.toString(), icon: Activity, trend: "Live", color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight italic uppercase">Centre de Contrôle</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Analyses de performance en temps réel</p>
        </div>
        <div className="bg-white/5 border border-white/5 px-6 py-2 rounded-full text-xs font-black uppercase text-slate-500">
            État du système : <span className="text-green-500 font-bold">Optimal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card flex flex-col justify-between group hover:border-primary/30 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.color} bg-white/5 border border-white/5`}>
                    {stat.trend}
                </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black italic">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              <div className="stat-card !p-8">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-bold italic uppercase tracking-tight">Analyse du Revenu</h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg">HEBDOMADAIRE</span>
                        <span className="px-3 py-1 bg-white/5 text-slate-500 text-[10px] font-black rounded-lg">MENSUEL</span>
                    </div>
                  </div>
                  <div className="h-80 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                      <div className="text-center">
                          <TrendingUp className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Moteur de graphiques actif</p>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="stat-card p-8">
                      <div className="flex items-center gap-4 mb-6">
                          <Utensils className="text-orange-500" />
                          <h4 className="font-bold uppercase italic">Produit Populaire</h4>
                      </div>
                      <p className="text-slate-500 text-sm mb-4">Le plus commandé cette semaine :</p>
                      <p className="text-2xl font-black">{stats.bestSeller}</p>
                  </div>
                  <div className="stat-card p-8 group">
                      <div className="flex items-center gap-4 mb-6">
                          <MessageSquare className="text-primary" />
                          <h4 className="font-bold uppercase italic">Satisfaction Client</h4>
                      </div>
                      <p className="text-slate-500 text-sm mb-4">Score de retour récent :</p>
                      <p className="text-2xl font-black text-green-500">4.9 / 5.0</p>
                  </div>
              </div>
          </div>

          <div className="space-y-8">
            <div className="stat-card !p-8 h-full">
                <h3 className="text-xl font-bold mb-8 italic uppercase tracking-tight">Cuisine en Direct</h3>
                <div className="space-y-6">
                    {stats.activePrep === 0 ? (
                        <div className="py-20 text-center text-slate-600 text-sm font-bold italic">
                            Toutes les commandes sont livrées !
                        </div>
                    ) : (
                        [1, 2, 3].slice(0, stats.activePrep).map(id => (
                            <div key={id} className="flex flex-col gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-orange-500/20 transition-all">
                                <div className="flex items-center justify-between">
                                    <p className="font-black text-xs text-primary">#ORD-320{id}</p>
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full border border-primary/20">
                                        PRÉPARATION
                                    </span>
                                </div>
                                <p className="text-sm font-bold">2x Reine Gourmet, 1x Cola</p>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "65%" }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>
                        ))
                    )}
                    
                    <button className="w-full py-4 bg-white/5 border border-white/5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-white/10 transition-colors">
                        VOIR TOUTES LES COMMANDES
                    </button>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}
