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
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl flex items-center justify-center font-black text-2xl shadow-xl border border-white/10">
                        {user.firstName.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">{user.firstName} {user.lastName}</h1>
                        <p className="text-slate-400 font-bold">{user.email}</p>
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
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-12 w-fit">
                {[
                    { id: "orders", icon: Package, label: "Commandes" },
                    { id: "addresses", icon: MapPin, label: "Adresses" },
                    { id: "profile", icon: User, label: "Profil" }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                            activeTab === tab.id ? "bg-red-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            <section className="min-h-[400px]">
                {activeTab === "orders" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500 font-bold">Aucune commande trouvée. Un petit creux ?</p>
                            </div>
                        ) : orders.map((order) => (
                            <div key={order.id} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] transition-all group">
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
                                        <p className="text-lg font-bold">{order.items.length} Produits • {parseFloat(order.total).toFixed(2)}€</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                                            <Clock className="w-3 h-3" /> Commandé le {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-6 py-4 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 group-hover:bg-red-600 group-hover:border-red-600 transition-all">
                                        Voir Détails <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeTab === "addresses" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* New Address Form */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Plus className="text-red-500" /> Ajouter une adresse</h3>
                            <form onSubmit={addAddress} className="space-y-4">
                                <input 
                                    type="text" placeholder="Rue" required
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:border-red-500 transition-all outline-none"
                                    value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        type="text" placeholder="Ville" required
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:border-red-500 outline-none"
                                        value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                    />
                                    <input 
                                        type="text" placeholder="Code Postal" required
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:border-red-500 outline-none"
                                        value={newAddress.zipCode} onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})}
                                    />
                                </div>
                                <button type="submit" className="w-full py-4 bg-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl">
                                    Enregistrer l'adresse
                                </button>
                            </form>
                        </div>

                        {/* Address List */}
                        <div className="space-y-4">
                            {addresses.map(addr => (
                                <div key={addr.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-start justify-between group">
                                    <div>
                                        <p className="font-bold">{addr.street}</p>
                                        <p className="text-sm text-slate-500">{addr.zipCode} {addr.city}</p>
                                    </div>
                                    <button 
                                        onClick={() => deleteAddress(addr.id)}
                                        className="p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === "profile" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
                            <h3 className="text-lg font-bold mb-8 flex items-center gap-2"><User className="text-red-500" /> Modifier mon profil</h3>
                            <form onSubmit={updateProfile} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Prénom</label>
                                        <input 
                                            type="text" required
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 font-bold focus:border-red-500 outline-none"
                                            value={profileForm.firstName} onChange={e => setProfileForm({...profileForm, firstName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Nom</label>
                                        <input 
                                            type="text" required
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 font-bold focus:border-red-500 outline-none"
                                            value={profileForm.lastName} onChange={e => setProfileForm({...profileForm, lastName: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Email</label>
                                    <input 
                                        type="email" disabled
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 font-bold text-slate-600 cursor-not-allowed"
                                        value={profileForm.email}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Téléphone</label>
                                    <input 
                                        type="tel" required
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 font-bold focus:border-red-500 outline-none"
                                        value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                                    />
                                </div>
                                <button 
                                    disabled={loading}
                                    className="w-full py-5 bg-red-600 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl flex items-center justify-center gap-3"
                                >
                                    {loading ? "Mise à jour..." : <><Save className="w-5 h-5" /> Enregistrer les modifications</>}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </section>
        </main>
    )
}

