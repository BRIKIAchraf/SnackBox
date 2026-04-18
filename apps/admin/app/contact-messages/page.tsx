"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Clock, Trash2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get("https://api-production-48c5.up.railway.app/api/v1/contact");
        setMessages(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-primary">Customer Messages</h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Read and respond to inquiries from your customers.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {messages.length === 0 ? (
            <div className="stat-card py-20 text-center text-slate-500 italic font-bold">
                No messages yet. Everything is quiet!
            </div>
        ) : (
            messages.map((msg, i) => (
                <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="stat-card flex flex-col md:flex-row md:items-start gap-8 group hover:border-primary/20 transition-all"
                >
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h4 className="text-xl font-black italic uppercase tracking-tighter">{msg.name}</h4>
                                <p className="text-sm font-bold text-primary">{msg.email}</p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                <Clock className="w-4 h-4" />
                                {new Date(msg.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed bg-white/5 p-6 rounded-2xl italic border border-white/5 text-sm font-medium">
                            "{msg.message}"
                        </p>
                    </div>
                    <div className="flex md:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 bg-white/5 hover:bg-green-500/20 hover:text-green-500 rounded-xl transition-colors border border-white/5 shadow-lg">
                            <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-colors border border-white/5 shadow-lg">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            ))
        )}
      </div>
    </div>
  );
}
