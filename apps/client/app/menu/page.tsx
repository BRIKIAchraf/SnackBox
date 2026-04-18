"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Flame, Clock, Info, MapPin, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cart-store';
import { Navbar } from '../../components/Navbar';
import { Logo } from '../../components/Logo';
import { PizzaCard } from '../../components/PizzaCard';
import { PizzaCustomizer } from '../../components/PizzaCustomizer';
import { API_BASE } from '../../lib/api-config';

export default function MenuPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [selectedPizza, setSelectedPizza] = useState<any>(null);
    const [isCustomizing, setIsCustomizing] = useState(false);
    
    const addItem = useCartStore((state: any) => state.addItem);

    const fetchData = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                axios.get(`${API_BASE}/categories`),
                axios.get(`${API_BASE}/products`)
            ]);
            setCategories(catRes.data);
            setProducts(prodRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredProducts = activeCategory === 'all' 
        ? products 
        : products.filter(p => p.categoryId === activeCategory);

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-primary uppercase tracking-widest text-3xl italic">Préparation du Menu...</div>;

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />
            
            {/* MENU HERO SECTION WITH BACKGROUND PHOTO */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=2000" 
                        className="w-full h-full object-cover grayscale opacity-50" 
                        alt="Menu Background" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                </div>

                {/* Logo watermark */}
                <div className="absolute bottom-6 right-8 opacity-10 pointer-events-none hidden lg:block">
                    <Logo size="lg" />
                </div>

                <div className="relative z-10 text-center space-y-4 px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-6 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4"
                    >
                        EXPLOREZ NOS SAVEURS
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl md:text-9xl font-black italic uppercase italic tracking-tighter leading-none"
                    >
                        NOTRE <span className="text-primary italic">SÉLECTION</span>
                    </motion.h1>
                    <p className="text-slate-400 font-bold max-w-lg mx-auto text-lg italic">Le meilleur de la street-food, préparé avec passion et produits frais.</p>
                </div>
            </section>

            <div className="wood-bg-overlay wood-section-mask-top border-y border-white/5">
                <div className="container mx-auto px-6 py-12">
                    {/* Category selection */}
                    <div className="flex gap-3 overflow-x-auto pb-12 mask-fade scrollbar-hide">
                        <button 
                            onClick={() => setActiveCategory('all')}
                            className={`flex items-center gap-3 px-8 py-5 rounded-full font-black uppercase text-xs tracking-widest transition-all whitespace-nowrap ${activeCategory === 'all' ? 'bg-primary text-black shadow-xl shadow-primary/20 scale-105' : 'bg-white/5 text-slate-500 hover:text-white border border-white/5 backdrop-blur-sm'}`}
                        >
                            <div className={`w-5 h-5 rounded-lg ${activeCategory === 'all' ? 'bg-black/20' : 'bg-white/10'}`} /> Toutes nos Recettes
                        </button>
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-3 px-8 py-5 rounded-full font-black uppercase text-xs tracking-widest transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-primary text-black shadow-xl shadow-primary/20 scale-105' : 'bg-white/5 text-slate-500 hover:text-white border border-white/5 backdrop-blur-sm'}`}
                            >
                                <div className={`w-5 h-5 rounded-lg ${activeCategory === cat.id ? 'bg-black/20' : 'bg-white/10'}`} /> {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-32">
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((product) => (
                                <PizzaCard 
                                    key={product.id}
                                    {...product}
                                    price={parseFloat(product.price)}
                                    onCustomize={() => {
                                        setSelectedPizza(product);
                                        setIsCustomizing(true);
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Customizer Modal */}
            <PizzaCustomizer 
                isOpen={isCustomizing}
                onClose={() => setIsCustomizing(false)}
                pizza={selectedPizza}
                onAddToCart={(customized) => {
                    addItem({ 
                        ...customized, 
                        price: parseFloat(customized.price),
                        id: `${customized.id}-${Date.now()}`
                    });
                }}
            />
        </main>
    )
}
