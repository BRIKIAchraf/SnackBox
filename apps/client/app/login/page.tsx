"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Mail, Lock, ChevronRight, User, Phone, ArrowLeft, Pizza } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { API_BASE } from "../../lib/api-config";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [form, setForm] = useState({
        email: "", password: "", firstName: "", lastName: "", phone: ""
    });

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = isLogin ? "login" : "register";
        try {
            const { data } = await axios.post(`${API_BASE}/auth/${endpoint}`, form);
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/profile");
        } catch (e) {
            console.error(e);
            alert(`${isLogin ? "Connexion" : "Inscription"} échouée`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-10 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
            {/* OVERLAY FOR SITE-WIDE BACKGROUND */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

            <div className="relative w-full max-w-6xl md:h-[700px] bg-[#111] rounded-[2.5rem] md:rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row border border-white/5">
                
                {/* FORM PANEL - SIDE ON DESKTOP, FULL ON MOBILE */}
                <motion.div 
                    initial={false}
                    animate={{ x: isLogin ? 0 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : "100%") }}
                    transition={{ type: "spring", damping: 25, stiffness: 120 }}
                    className={`w-full md:w-1/2 h-full z-20 flex bg-[#111] border-white/5 transition-all duration-500`}
                >
                    <div className="w-full h-full p-8 md:p-16 flex flex-col justify-center">
                        <Link href="/" className="mb-6 md:mb-10 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black uppercase text-[10px] tracking-widest">
                            <ArrowLeft className="w-4 h-4" /> <span>Retour à l'accueil</span>
                        </Link>

                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={isLogin ? 'login' : 'register'}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="space-y-6 md:space-y-10"
                            >
                                <div className="space-y-2">
                                    <h1 className="text-4xl md:text-6xl font-black uppercase italic italic">{isLogin ? "Bon Retour" : "Rejoindre l'élite"}</h1>
                                    <p className="text-slate-500 font-bold text-sm italic">{isLogin ? "Prêt pour votre dose de saveurs ?" : "Inscrivez-vous pour des privilèges exclusifs."}</p>
                                </div>

                                <form onSubmit={handleAuth} className="space-y-4">
                                    {!isLogin && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <input required className="input-field !py-4" placeholder="Prénom" onChange={e => setForm({...form, firstName: e.target.value})} />
                                            <input required className="input-field !py-4" placeholder="Nom" onChange={e => setForm({...form, lastName: e.target.value})} />
                                        </div>
                                    )}
                                    <input type="email" required className="input-field !py-4" placeholder="Adresse Email" onChange={e => setForm({...form, email: e.target.value})} />
                                    <input type="password" required className="input-field !py-4" placeholder="Mot de passe" onChange={e => setForm({...form, password: e.target.value})} />
                                    
                                    <button disabled={loading} className="w-full btn-primary h-14 md:h-20 mt-6 text-base tracking-[0.2em]">
                                        {loading ? "AUTHENTIFICATION..." : isLogin ? "SE CONNECTER" : "CONFIRMER L'INSCRIPTION"}
                                    </button>
                                </form>

                                {/* TOGGLE FOR MOBILE ONLY */}
                                <div className="pt-6 md:hidden text-center">
                                    <button 
                                        onClick={() => setIsLogin(!isLogin)} 
                                        className="text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-primary transition-colors"
                                    >
                                        {isLogin ? "Pas encore membre ? S'inscrire" : "Déjà membre ? Se connecter"}
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* IMAGE PANELS - HIDDEN ON MOBILE */}
                <div className="hidden md:flex w-full h-full relative">
                    {/* Panel Images (Same as before but with better overlay) */}
                    <div className="w-1/2 h-full relative overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-16 flex flex-col justify-end">
                            <h3 className="text-4xl font-black uppercase italic">Nouveau ici ?</h3>
                            <button onClick={() => setIsLogin(false)} className="mt-6 px-10 py-5 border-2 border-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all w-fit">DÉCOUVRIR LE CLUB</button>
                        </div>
                    </div>

                    <div className="w-1/2 h-full relative overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-16 flex flex-col justify-end">
                            <h3 className="text-4xl font-black uppercase italic">Déjà membre ?</h3>
                            <button onClick={() => setIsLogin(true)} className="mt-6 px-10 py-5 border-2 border-primary rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary hover:text-black transition-all w-fit text-primary italic">ACCÈS PRIVÉ</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
