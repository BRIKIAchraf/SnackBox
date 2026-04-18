"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Lock, Mail, ChevronRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "../../components/Logo";
import { API_BASE } from "../../lib/api-config";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
      
      if (data.user.role !== 'ADMIN' && data.user.role !== 'MANAGER') {
          throw new Error("Unauthorized access. Admin privileges required.");
      }

      localStorage.setItem("admin_token", data.access_token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
            <div className="mb-6 flex justify-center">
                <Logo size="lg" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white">Admin <span className="text-primary">Access</span></h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Snack Box Central Intelligence</p>
        </div>

        <div className="glass-card p-10 border-white/5 bg-white/[0.02]">
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Authorized Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                            type="email" 
                            required 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-primary/50 outline-none transition-all font-bold"
                            placeholder="admin@snackbox.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Secret Key</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                            type="password" 
                            required 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-primary/50 outline-none transition-all font-bold"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex items-center gap-3"
                    >
                        <ShieldCheck className="w-5 h-5" /> {error}
                    </motion.div>
                )}

                <button 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase italic tracking-widest"
                >
                    {loading ? "Authenticating..." : (
                        <>Enter Dashboard <ChevronRight className="w-5 h-5" /></>
                    )}
                </button>
            </form>
        </div>

        <div className="text-center mt-12 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
            System Ver: 1.1.0-Stable • Encrypted JWT Layer
        </div>
      </motion.div>
    </main>
  );
}
