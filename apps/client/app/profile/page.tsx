"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Package, Clock, MapPin, ChevronRight, User } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
            }
        }

        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            try {
                // In real app: fetch only my orders
                const { data } = await axios.get("https://api-production-48c5.up.railway.app/api/v1/orders", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchOrders();
    }, []);

    if (!user) return <div className="p-20 text-center">Please log in to view your profile.</div>;

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-6 mb-16">
                <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center font-black text-2xl shadow-xl">
                    {user.firstName.charAt(0)}
                </div>
                <div>
                    <h1 className="text-4xl font-black italic uppercase italic">{user.firstName} {user.lastName}</h1>
                    <p className="text-slate-400 font-bold">{user.email}</p>
                </div>
            </div>

            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold uppercase italic tracking-widest flex items-center gap-3">
                        <Package className="text-red-500" /> Recent Orders
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <p className="text-slate-500 font-bold">No orders found. Time for some pizza?</p>
                        </div>
                    ) : orders.map((order) => (
                        <motion.div 
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] transition-all group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase">
                                            {order.status}
                                        </span>
                                        <span className="text-xs text-slate-500 font-bold">#{order.id.slice(0,8).toUpperCase()}</span>
                                    </div>
                                    <p className="text-lg font-bold">{order.items.length} Items • {parseFloat(order.total).toFixed(2)}€</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                                        <Clock className="w-3 h-3" /> Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                
                                <button className="flex items-center gap-2 px-6 py-4 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 group-hover:bg-red-600 group-hover:border-red-600 transition-all">
                                    Track Order <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    )
}
