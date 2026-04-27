"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Package, Clock, MapPin, ChevronRight, User, LogOut, Save, Plus, Trash2, CheckCircle2, ShieldCheck, CreditCard, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { API_BASE } from "../../lib/api-config";
import { ProfileSidebar } from "../../components/ProfileSidebar";
import { Navbar } from "../../components/Navbar";

export default function ProfilePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile" | "settings">("orders");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user:", error);
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const { data: orders = [], isLoading: ordersLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE}/orders`, { headers: { Authorization: `Bearer ${token}` } });
            return res.data;
        },
        enabled: !!user,
    });

    const { data: addresses = [], isLoading: addressesLoading } = useQuery({
        queryKey: ["addresses"],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE}/addresses`, { headers: { Authorization: `Bearer ${token}` } });
            return res.data;
        },
        enabled: !!user,
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (formData: any) => {
            const token = localStorage.getItem("token");
            return axios.patch(`${API_BASE}/users/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: (res) => {
            const updatedUser = res.data;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success("Profil mis à jour !");
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: () => toast.error("Erreur lors de la mise à jour")
    });

    const addAddressMutation = useMutation({
        mutationFn: async (newAddress: any) => {
            const token = localStorage.getItem("token");
            return axios.post(`${API_BASE}/addresses`, newAddress, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success("Adresse ajoutée !");
        },
        onError: () => toast.error("Erreur lors de l'ajout")
    });

    const deleteAddressMutation = useMutation({
        mutationFn: async (id: string) => {
            const token = localStorage.getItem("token");
            return axios.delete(`${API_BASE}/addresses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success("Adresse supprimée");
        }
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
        router.refresh();
    };

    if (!user) return null;

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />
            
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 blur-[120px] rounded-full -mr-[20vw] -mt-[20vw]" />
                <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-primary/5 blur-[100px] rounded-full -ml-[15vw] -mb-[15vw]" />
            </div>

            <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <ProfileSidebar 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                        user={user} 
                        onLogout={handleLogout} 
                    />

                    {/* Content Area */}
                    <div className="flex-grow">
                        <AnimatePresence mode="wait">
                            {activeTab === "orders" && (
                                <motion.div 
                                    key="orders"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Historique de <span className="text-primary">Commandes</span></h2>
                                        <div className="bg-[#121215] border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            {orders.length} Commandes au total
                                        </div>
                                    </div>

                                    {ordersLoading ? (
                                        <div className="space-y-4">
                                            {[1,2,3].map(i => <div key={i} className="h-40 bg-white/5 animate-pulse rounded-[2.5rem]" />)}
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-32 bg-[#121215] rounded-[3rem] border border-dashed border-white/10">
                                            <Package className="w-16 h-16 text-white/5 mx-auto mb-6" />
                                            <p className="text-slate-600 font-black uppercase tracking-widest text-xs">Vous n'avez pas encore passé de commande.</p>
                                        </div>
                                    ) : (
                                        orders.map((order: any) => (
                                            <div key={order.id} className="bg-[#121215] border border-white/5 rounded-[2.5rem] p-8 hover:border-primary/30 transition-all group relative overflow-hidden shadow-2xl">
                                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                                order.status === "COMPLETED" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-primary/10 text-primary border border-primary/20"
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                            <span className="text-xs text-slate-500 font-bold tracking-tighter">ORD-{order.id.slice(0,8).toUpperCase()}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <p className="text-3xl font-black italic tracking-tighter text-white uppercase">
                                                                {order.items.length} {order.items.length > 1 ? 'Articles' : 'Article'} • <span className="text-primary">{parseFloat(order.total).toFixed(2)}€</span>
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                                    Commandé le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button 
                                                            onClick={() => router.push(`/order-status/${order.id}`)}
                                                            className="flex items-center gap-3 px-8 py-5 bg-white/[0.03] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-white/5 group-hover:bg-primary group-hover:text-black transition-all shadow-xl"
                                                        >
                                                            SUIVRE <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "addresses" && (
                                <motion.div 
                                    key="addresses"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-10"
                                >
                                    <div className="bg-[#121215] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-10 opacity-5">
                                            <MapPin className="w-32 h-32 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-black uppercase italic mb-10 flex items-center gap-4 tracking-widest text-white relative z-10">
                                            <Plus className="text-primary w-6 h-6" /> NOUVELLE ADRESSE
                                        </h3>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.currentTarget);
                                            addAddressMutation.mutate(Object.fromEntries(formData));
                                            (e.target as HTMLFormElement).reset();
                                        }} className="space-y-6 relative z-10">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-slate-600 ml-4 tracking-[0.3em]">Rue / Résidence / Étage</label>
                                                <input name="street" type="text" required className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm font-bold focus:border-primary/50 transition-all outline-none text-white" placeholder="ex: 12 Rue de la Pizza, Appt 4" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 tracking-[0.3em]">Ville</label>
                                                    <input name="city" type="text" required className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm font-bold focus:border-primary/50 outline-none text-white" placeholder="Paris" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 tracking-[0.3em]">Code Postal</label>
                                                    <input name="zipCode" type="text" required className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm font-bold focus:border-primary/50 outline-none text-white" placeholder="75001" />
                                                </div>
                                            </div>
                                            <button type="submit" disabled={addAddressMutation.isPending} className="w-full py-5 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-orange-500 transition-all shadow-[0_15px_30px_rgba(255,106,0,0.2)]">
                                                {addAddressMutation.isPending ? "ENREGISTREMENT..." : "ENREGISTRER L'ADRESSE"}
                                            </button>
                                        </form>
                                    </div>

                                    <div className="space-y-6">
                                        {addressesLoading ? (
                                            <div className="space-y-4">
                                                {[1,2].map(i => <div key={i} className="h-32 bg-white/5 animate-pulse rounded-[2rem]" />)}
                                            </div>
                                        ) : addresses.map((addr: any) => (
                                            <div key={addr.id} className="bg-[#121215] border border-white/5 rounded-[2rem] p-8 flex items-start justify-between group shadow-xl hover:border-primary/20 transition-all">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <MapPin className="w-4 h-4 text-primary" />
                                                        <p className="font-black uppercase tracking-tight italic text-xl text-white">{addr.street}</p>
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2 ml-6">{addr.zipCode} {addr.city}</p>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        if(confirm("Supprimer cette adresse ?")) deleteAddressMutation.mutate(addr.id);
                                                    }}
                                                    className="p-4 bg-red-500/10 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-xl"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "profile" && (
                                <motion.div 
                                    key="profile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="max-w-4xl"
                                >
                                    <div className="bg-[#121215] border border-white/5 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-600" />
                                        <div className="flex items-center gap-4 mb-12">
                                            <div className="p-3 bg-primary/10 rounded-2xl">
                                                <User className="text-primary w-8 h-8" />
                                            </div>
                                            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">ÉDITION DU <span className="text-primary">PROFIL</span></h3>
                                        </div>

                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.currentTarget);
                                            updateProfileMutation.mutate(Object.fromEntries(formData));
                                        }} className="space-y-10">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase text-slate-600 ml-6 tracking-[0.3em]">Prénom</label>
                                                    <input 
                                                        name="firstName" type="text" required defaultValue={user.firstName}
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 font-bold focus:border-primary/50 outline-none text-white transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase text-slate-600 ml-6 tracking-[0.3em]">Nom de famille</label>
                                                    <input 
                                                        name="lastName" type="text" required defaultValue={user.lastName}
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 font-bold focus:border-primary/50 outline-none text-white transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase text-slate-600 ml-6 tracking-[0.3em]">Adresse E-mail</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="email" disabled defaultValue={user.email}
                                                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 font-bold text-slate-700 cursor-not-allowed pl-14"
                                                        />
                                                        <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-800" />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase text-slate-600 ml-6 tracking-[0.3em]">Numéro de Téléphone</label>
                                                    <input 
                                                        name="phone" type="tel" required defaultValue={user.phone}
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 font-bold focus:border-primary/50 outline-none text-white transition-all"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="pt-6">
                                                <button 
                                                    type="submit"
                                                    disabled={updateProfileMutation.isPending}
                                                    className="w-full py-6 bg-gradient-to-r from-primary to-orange-600 rounded-3xl font-black text-[12px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,106,0,0.25)] flex items-center justify-center gap-4 text-white"
                                                >
                                                    {updateProfileMutation.isPending ? "TRAITEMENT..." : <><Save className="w-5 h-5" /> ENREGISTRER LES MODIFICATIONS</>}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "settings" && (
                                <motion.div 
                                    key="settings"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="max-w-4xl space-y-8"
                                >
                                    <div className="bg-[#121215] border border-white/5 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                                        <h3 className="text-2xl font-black uppercase italic mb-10 flex items-center gap-4 tracking-widest text-white">
                                            <Bell className="text-primary w-6 h-6" /> NOTIFICATIONS & SÉCURITÉ
                                        </h3>
                                        
                                        <div className="space-y-6">
                                            {[
                                                { label: "Alertes par Email", desc: "Recevoir les mises à jour de commande par email", enabled: true },
                                                { label: "SMS de livraison", desc: "Recevoir un SMS quand le livreur approche", enabled: true },
                                                { label: "Offres Marketing", desc: "Recevoir nos codes promos et nouveautés", enabled: false },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 bg-black/20 rounded-[1.8rem] border border-white/5">
                                                    <div>
                                                        <p className="text-sm font-black uppercase text-white tracking-widest">{item.label}</p>
                                                        <p className="text-xs text-slate-500 font-bold">{item.desc}</p>
                                                    </div>
                                                    <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-500 cursor-pointer ${item.enabled ? 'bg-primary' : 'bg-white/10'}`}>
                                                        <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-500 ${item.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-red-500/5 border border-red-500/10 rounded-[3rem] p-12 shadow-2xl">
                                        <h3 className="text-xl font-black uppercase italic mb-6 text-red-500">Zone de Danger</h3>
                                        <p className="text-xs text-slate-500 font-bold mb-8">La suppression de votre compte est irréversible. Toutes vos données seront effacées.</p>
                                        <button className="px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                            SUPPRIMER MON COMPTE
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
