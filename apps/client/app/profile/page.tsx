"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Package, Clock, MapPin, ChevronRight, User, LogOut, Save, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const API_URL = "https://api-production-48c5.up.railway.app/api/v1";

export default function ProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");
    const [orders, setOrders] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    // Form states
    const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const [newAddress, setNewAddress] = useState({ street: "", city: "", zipCode: "", instructions: "" });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setProfileForm({
                    firstName: parsedUser.firstName || "",
                    lastName: parsedUser.lastName || "",
                    email: parsedUser.email || "",
                    phone: parsedUser.phone || ""
                });
            } catch (error) {
                console.error("Error parsing user:", error);
            }
        } else {
            router.push("/login");
        }

        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const [ordersRes, addrRes] = await Promise.all([
                axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/addresses`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setOrders(ordersRes.data);
            setAddresses(addrRes.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
        router.refresh();
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const { data } = await axios.patch(`${API_URL}/users/profile`, profileForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
            setTimeout(() => setMessage(null), 3000);
        } catch (e) {
            setMessage({ type: "error", text: "Erreur lors de la mise à jour." });
        } finally {
            setLoading(false);
        }
    };

    const addAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            await axios.post(`${API_URL}/addresses`, newAddress, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewAddress({ street: "", city: "", zipCode: "", instructions: "" });
            fetchData();
            setMessage({ type: "success", text: "Adresse ajoutée !" });
            setTimeout(() => setMessage(null), 3000);
        } catch (e) {
            setMessage({ type: "error", text: "Erreur lors de l'ajout." });
        }
    };

    const deleteAddress = async (id: string) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${API_URL}/addresses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    if (!user) return null;

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto">
            {/* Notification Toast */}
            <AnimatePresence>
                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`fixed top-24 right-6 p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 font-bold border ${
                            message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                        }`}
                    >
                        {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-black rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-2xl border border-white/10 rotate-3 transition-transform hover:rotate-0 duration-500">
                        {user.firstName.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">{user.firstName} <span className="text-red-600">{user.lastName}</span></h1>
                        <p className="text-slate-500 font-bold tracking-[0.3em] text-[10px] uppercase opacity-50">{user.email}</p>
                    </div>
                </div>
                
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-4 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-red-600/10 hover:border-red-600/30 text-slate-400 hover:text-red-500 transition-all w-fit"
                >
                    <LogOut className="w-4 h-4" /> Déconnexion
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-4 p-2 bg-[#0D0D0D] rounded-3xl mb-16 w-fit max-w-full border border-white/5 shadow-2xl">
                {[
                    { id: "orders", icon: Package, label: "Commandes" },
                    { id: "addresses", icon: MapPin, label: "Adresses" },
                    { id: "profile", icon: User, label: "Profil" }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${
                            activeTab === tab.id ? "bg-red-600 text-white shadow-[0_10px_30px_rgba(220,38,38,0.3)] scale-105" : "text-slate-500 hover:text-white"
                        }`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            <section className="min-h-[400px]">
                {activeTab === "orders" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        {orders.length === 0 ? (
                            <div className="text-center py-32 bg-[#0D0D0D] rounded-[3rem] border border-dashed border-white/5">
                                <Package className="w-16 h-16 text-white/5 mx-auto mb-6" />
                                <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">Aucune commande trouvée</p>
                            </div>
                        ) : orders.map((order) => (
                            <div key={order.id} className="bg-[#0D0D0D] border border-white/5 rounded-[3rem] p-10 hover:border-red-600/30 transition-all group shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                                                order.status === "COMPLETED" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                            }`}>
                                                {order.status}
                                            </span>
                                            <span className="text-xs text-slate-500 font-bold">#{order.id.slice(0,8).toUpperCase()}</span>
                                        </div>
                                        <p className="text-3xl font-black italic tracking-tighter text-white uppercase">{order.items.length} PRODUITS • <span className="text-red-600">{parseFloat(order.total).toFixed(2)}€</span></p>
                                        <div className="flex items-center gap-3 text-[10px] text-slate-600 font-black uppercase tracking-widest">
                                            <Clock className="w-4 h-4 text-red-600/50" /> {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-3 px-8 py-5 bg-white/[0.02] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-white/5 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl">
                                        DÉTAILS <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeTab === "addresses" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* New Address Form */}
                        <div className="bg-[#0D0D0D] border border-white/5 rounded-[3rem] p-12 shadow-2xl">
                            <h3 className="text-xl font-black uppercase italic mb-10 flex items-center gap-4 tracking-widest text-white"><Plus className="text-red-600" /> NOUVELLE ADRESSE</h3>
                            <form onSubmit={addAddress} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 tracking-[0.3em]">Rue / Résidence</label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-[#050505] border border-white/5 rounded-2xl p-5 text-sm font-bold focus:border-red-600/50 transition-all outline-none text-white"
                                        value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-600 ml-4 tracking-[0.3em]">Ville</label>
                                        <input 
                                            type="text" required
                                            className="w-full bg-[#050505] border border-white/5 rounded-2xl p-5 text-sm font-bold focus:border-red-600/50 outline-none text-white"
                                            value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-600 ml-4 tracking-[0.3em]">Code Postal</label>
                                        <input 
                                            type="text" required
                                            className="w-full bg-[#050505] border border-white/5 rounded-2xl p-5 text-sm font-bold focus:border-red-600/50 outline-none text-white"
                                            value={newAddress.zipCode} onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-5 bg-red-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-[0_15px_30px_rgba(220,38,38,0.2)]">
                                    ENREGISTRER L'ADRESSE
                                </button>
                            </form>
                        </div>

                        {/* Address List */}
                        <div className="space-y-6">
                            {addresses.map(addr => (
                                <div key={addr.id} className="bg-[#0D0D0D] border border-white/5 rounded-[2rem] p-10 flex items-start justify-between group shadow-xl">
                                    <div>
                                        <p className="font-black uppercase tracking-tight italic text-xl text-white">{addr.street}</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-2">{addr.zipCode} {addr.city}</p>
                                    </div>
                                    <button 
                                        onClick={() => deleteAddress(addr.id)}
                                        className="p-4 bg-red-600/10 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white shadow-xl"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === "profile" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
                        <div className="bg-[#0D0D0D] border border-white/5 rounded-[3rem] p-16 shadow-2xl">
                            <h3 className="text-2xl font-black uppercase italic mb-12 flex items-center gap-4 tracking-widest text-white"><User className="text-red-600 w-6 h-6" /> ÉDITION DU PROFIL</h3>
                            <form onSubmit={updateProfile} className="space-y-10">
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-slate-600 ml-6 tracking-[0.3em]">Prénom</label>
                                        <input 
                                            type="text" required
                                            className="w-full bg-[#050505] border border-white/5 rounded-2xl p-6 font-bold focus:border-red-600/50 outline-none text-white transition-all"
                                            value={profileForm.firstName} onChange={e => setProfileForm({...profileForm, firstName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-slate-600 ml-6 tracking-[0.3em]">Nom de famille</label>
                                        <input 
                                            type="text" required
                                            className="w-full bg-[#050505] border border-white/5 rounded-2xl p-6 font-bold focus:border-red-600/50 outline-none text-white transition-all"
                                            value={profileForm.lastName} onChange={e => setProfileForm({...profileForm, lastName: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-600 ml-6 tracking-[0.3em]">Adresse E-mail</label>
                                    <input 
                                        type="email" disabled
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 font-bold text-slate-700 cursor-not-allowed"
                                        value={profileForm.email}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-600 ml-6 tracking-[0.3em]">Numéro de Téléphone</label>
                                    <input 
                                        type="tel" required
                                        className="w-full bg-[#050505] border border-white/5 rounded-2xl p-6 font-bold focus:border-red-600/50 outline-none text-white transition-all"
                                        value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                                    />
                                </div>
                                <button 
                                    disabled={loading}
                                    className="w-full py-6 bg-red-600 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] hover:bg-red-700 transition-all shadow-[0_20px_40px_rgba(220,38,38,0.25)] flex items-center justify-center gap-4"
                                >
                                    {loading ? "TRAITEMENT..." : <><Save className="w-5 h-5" /> SAUVEGARDER LES MODIFICATIONS</>}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </section>
        </main>
    )
}

