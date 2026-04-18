"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { Logo } from "../components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star, Quote, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PizzaCard } from "../components/PizzaCard";

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=2000"
];

const REVIEWS = [
    { name: "Marc-Antoine", rating: 5, text: "La meilleure pizza que j'ai mangée depuis mon voyage à Naples. Le service est ultra-rapide !", date: "Il y a 2 jours" },
    { name: "Sophie L.", rating: 5, text: "Le système de personnalisation est incroyable. On sent vraiment la qualité des produits frais.", date: "Il y a 1 semaine" },
    { name: "Thomas V.", rating: 4, text: "Design du site au top et pizza arrivée encore brûlante. Je recommande les yeux fermés.", date: "Hier" }
];

import { API_BASE } from "../lib/api-config";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE}/products`)
      .then(res => setProducts(res.data.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* SECTION 1: HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div 
                key={heroIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${HERO_IMAGES[heroIndex]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
        </div>

          {/* Logo watermark décoration */}
          <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-10 pointer-events-none hidden xl:block">
              <Logo size="xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 block px-6 py-2 bg-white/90 backdrop-blur-xl border border-black/5 inline-block rounded-lg shadow-2xl"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">VOTRE FAST-FOOD À SNACK BOX DISTRICT</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[8rem] font-black leading-[0.9] tracking-tighter uppercase drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
          >
            La Boîte <br /> qui vous <span className="underline decoration-primary text-primary italic">régale!</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <Link href="/menu" className="group px-16 py-8 bg-primary hover:bg-primary-hover rounded-full font-black uppercase text-black text-lg transition-all shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center gap-4 mx-auto w-fit">
              COMMANDER ! <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
              {HERO_IMAGES.map((_, i) => (
                  <button key={i} onClick={() => setHeroIndex(i)} className={`h-1.5 rounded-full transition-all ${i === heroIndex ? 'w-12 bg-primary' : 'w-4 bg-white/50'}`} />
              ))}
          </div>
        </div>
      </section>

      {/* CONTINUOUS WOOD BACKGROUND FROM HERE TO FOOTER */}
      <div className="wood-bg-overlay wood-section-mask-top pt-20">
        
        {/* SECTION 2: OFFRES SPÉCIALES */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="mb-16 space-y-2 text-center md:text-left">
              <h2 className="text-4xl font-black italic uppercase tracking-widest text-white">OFFRES SPÉCIALES</h2>
              <div className="w-20 h-1 bg-primary rounded-full hidden md:block" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* CARD 1 */}
              <motion.div whileHover={{ scale: 1.02 }} className="relative aspect-[16/10] bg-[#0b0b0b] rounded-[2.5rem] p-10 flex flex-col justify-end overflow-hidden group shadow-2xl border border-white/5">
                  {/* Image Background */}
                  <div className="absolute inset-0 z-0">
                      <img src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Pizza Image" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                  </div>
                  {/* Badge */}
                  <div className="absolute top-8 left-8 px-4 py-2 bg-primary rounded-full text-[10px] font-black uppercase tracking-widest text-black z-10 shadow-lg">2+1 GRATUIT(S)</div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none uppercase">2 PIZZAS ACHETÉES <br /> <span className="text-primary">= 3ÈME OFFERTE</span></h3>
                  </div>
              </motion.div>

              {/* CARD 2 */}
              <motion.div whileHover={{ scale: 1.02 }} className="relative aspect-[16/10] bg-[#0b0b0b] rounded-[2.5rem] p-10 flex flex-col justify-end overflow-hidden group shadow-2xl border border-white/5">
                  {/* Image Background */}
                  <div className="absolute inset-0 z-0">
                      <img src="https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Pizza Image" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                  </div>
                  {/* Badge */}
                  <div className="absolute top-8 left-8 px-4 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-black z-10 shadow-lg">1+1 -50%</div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none uppercase">1 PIZZA ACHETÉE <br /> <span className="text-white/80">= LA 2ÈME À -50%</span></h3>
                  </div>
              </motion.div>

              {/* CARD 3 - PROMO */}
              <motion.div whileHover={{ scale: 1.02 }} className="relative aspect-[16/10] bg-[#0b0b0b] rounded-[2.5rem] p-10 flex flex-col justify-end overflow-hidden group shadow-2xl border border-primary/20">
                  {/* Image Background */}
                  <div className="absolute inset-0 z-0">
                      <img src="https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=800" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Burger Image" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
                  </div>
                  {/* Badge */}
                  <div className="absolute top-8 left-8 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/30 z-10">PROMO</div>
                  
                  {/* Center Sticker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/90 backdrop-blur-sm px-6 py-2 rounded-lg text-black font-black text-[12px] uppercase tracking-widest z-10 shadow-xl border border-primary/50 rotate-[-5deg]">
                      DISPONIBLE MARDI
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none mb-2 uppercase">MARDI SNACK !</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Toutes les boîtes, tous les plaisirs à prix réduit</p>
                  </div>
              </motion.div>
          </div>
        </section>

        {/* SECTION 3: GOURMET SELECTION (FEATURED MENU) */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                  <div className="space-y-4">
                      <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-none uppercase">NOS BOÎTES <br/> <span className="text-primary italic uppercase">GOURMANDES</span></h2>
                      <p className="text-slate-500 font-bold max-w-md italic">Les créations les plus généreuses de notre district.</p>
                  </div>
                  <Link href="/menu" className="group px-10 py-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:text-black transition-all flex items-center gap-3 font-black uppercase text-xs tracking-widest text-white hover:text-black">
                      VOIR TOUT LE MENU <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {loading ? [1,2,3,4,5].map(i => <div key={i} className="h-80 bg-white/5 animate-pulse rounded-[3rem]" />) : (
                      products.map((p, i) => (
                          <PizzaCard 
                              key={p.id}
                              id={p.id}
                              name={p.name}
                              description={p.description}
                              price={parseFloat(p.price)}
                              imageUrl={p.imageUrl}
                          />
                      ))
                  )}
              </div>
        </section>

        {/* SECTION 4: AVIS CLIENTS */}
        <section className="py-32">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-24 space-y-4">
                    <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white text-center leading-none uppercase">ILS ADORENT <br/><span className="text-primary italic uppercase">LA SNACK BOX</span></h2>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-12 h-[2px] bg-primary" />
                        <Star className="text-primary w-4 h-4 fill-primary" />
                        <div className="w-12 h-[2px] bg-primary" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {REVIEWS.map((review, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#0b0b0b]/60 backdrop-blur-md p-12 rounded-[3.5rem] border border-white/5 relative group hover:border-primary/20 transition-all">
                              <Quote className="absolute top-10 right-10 w-12 h-12 text-white/[0.03] group-hover:text-primary transition-colors" />
                              <div className="flex gap-1 text-primary mb-8">
                                  {[1,2,3,4,5].map(j => <Star key={j} className={`w-4 h-4 ${j <= review.rating ? 'fill-current' : ''}`} />)}
                              </div>
                              <p className="text-lg font-bold italic text-slate-300 mb-10 leading-relaxed italic">"{review.text}"</p>
                              <div className="flex items-center justify-between">
                                  <span className="font-black uppercase text-xs tracking-widest leading-none">{review.name}</span>
                                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">{review.date}</span>
                              </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>


      </div>
    </main>
  );
}
