"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Pizza } from "lucide-react";
import { Navbar } from "../../components/Navbar";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      {/* CONTACT HERO */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover grayscale opacity-30" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>
        <div className="relative z-10 text-center">
            <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter">CONTACTEZ <span className="text-primary italic">L'HUB</span></h1>
        </div>
      </section>

      <div className="wood-bg-overlay wood-section-mask-top border-y border-white/5 pb-20">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info Side */}
          <div className="space-y-12 relative z-10">
            <div className="space-y-6">
              <h2 className="text-4xl font-black uppercase italic tracking-tight text-white">REJOIGNEZ LA <span className="text-primary">FAMILLE</span></h2>
              <p className="text-slate-300 font-bold text-lg leading-relaxed italic">Des questions ? Des suggestions ? Notre équipe est à votre écoute 7j/7.</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group cursor-pointer">
                  <div className="w-14 h-14 bg-[#0b0b0b]/60 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:text-black transition-all group-hover:scale-110 shadow-xl">
                      <Phone className="w-6 h-6" />
                  </div>
                  <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">TÉLÉPHONE DIRECT</h4>
                      <a href="tel:+1555993221" className="text-2xl font-black hover:text-primary transition-colors text-white">+1 (555) 993-221</a>
                  </div>
              </div>

              <div className="flex items-start gap-6 group cursor-pointer">
                  <div className="w-14 h-14 bg-[#0b0b0b]/60 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:text-black transition-all group-hover:scale-110 shadow-xl">
                      <Mail className="w-6 h-6" />
                  </div>
                  <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">EMAIL SUPPORT</h4>
                      <a href="mailto:hello@snackbox.gourmet" className="text-2xl font-black hover:text-primary transition-colors text-white">hello@snackbox.gourmet</a>
                  </div>
              </div>

              <div className="flex items-start gap-6 group cursor-pointer">
                  <div className="w-14 h-14 bg-[#0b0b0b]/60 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:text-black transition-all group-hover:scale-110 shadow-xl">
                      <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">QUARTIER GÉNÉRAL</h4>
                      <p className="text-xl font-bold text-slate-300">124 Burger Street, Snackbox District, NY</p>
                  </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-[#0b0b0b]/80 backdrop-blur-md border border-white/10 p-12 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Pizza className="w-32 h-32" />
              </div>
              
              <form className="space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">PRÉNOM</label>
                          <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary focus:bg-white/10 transition-colors placeholder:text-white/20 font-bold" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">NOM</label>
                          <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary focus:bg-white/10 transition-colors placeholder:text-white/20 font-bold" placeholder="Doe" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">EMAIL</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary focus:bg-white/10 transition-colors placeholder:text-white/20 font-bold" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">MESSAGE</label>
                      <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary focus:bg-white/10 transition-colors placeholder:text-white/20 resize-none h-32 font-bold" placeholder="Comment pouvons-nous vous aider ?" />
                  </div>
                  <button className="btn-primary w-full h-16 mt-4 !rounded-2xl transition-transform hover:scale-105">
                      ENVOYER LE MESSAGE <Send className="w-5 h-5" />
                  </button>
              </form>
          </div>
        </div>
      </div>
    </main>
  );
}
