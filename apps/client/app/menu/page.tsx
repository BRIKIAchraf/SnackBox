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
import { OfferCustomizer } from '../../components/OfferCustomizer';
import { OrderModeModal } from '../../components/OrderModeModal';
import { StoreClosedModal } from '../../components/StoreClosedModal';
import { API_BASE } from '../../lib/api-config';

export default function MenuPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [offers, setOffers] = useState<any[]>([]);
    const [toppings, setToppings] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    
    const [selectedPizza, setSelectedPizza] = useState<any>(null);
    const [isCustomizing, setIsCustomizing] = useState(false);
    
    const [selectedOffer, setSelectedOffer] = useState<any>(null);
    const [isOfferCustomizing, setIsOfferCustomizing] = useState(false);
    const [isModeSelecting, setIsModeSelecting] = useState(false);
    const [isStoreClosedModal, setIsStoreClosedModal] = useState(false);
    const [settings, setSettings] = useState<any>(null);

    const addItem = useCartStore((state: any) => state.addItem);
    const addOffer = useCartStore((state: any) => state.addOffer);
    const orderMode = useCartStore((state: any) => state.orderMode);
    const setOrderMode = useCartStore((state: any) => state.setOrderMode);

    useEffect(() => {
        if (!orderMode) {
            setIsModeSelecting(true);
        }
    }, [orderMode]);

    const fetchData = async () => {
        try {
            const [catRes, prodRes, offRes, topRes, setRes] = await Promise.all([
                axios.get(`${API_BASE}/categories`),
                axios.get(`${API_BASE}/products`),
                axios.get(`${API_BASE}/offers`),
                axios.get(`${API_BASE}/products/toppings`),
                axios.get(`${API_BASE}/settings`)
            ]);
            setCategories(catRes.data);
            setProducts(prodRes.data);
            setOffers(offRes.data.filter((o: any) => o.available));
            setToppings(topRes.data);
            setSettings(setRes.data);
            
            if (setRes.data && !setRes.data.isOpen) {
                setIsStoreClosedModal(true);
            }
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
        ? products.filter(p => p.available)
        : products.filter(p => p.categoryId === activeCategory && p.available);

    if (loading) return <div className="p-40 text-center font-black animate-pulse text-primary uppercase tracking-widest text-3xl italic">Préparation du Menu...</div>;

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            {/* MENU HERO SECTION WITH BACKGROUND PHOTO */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
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
                    {/* OFFERS SECTION */}
                    {offers.length > 0 && activeCategory === 'all' && (
                        <div className="mb-20">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-1 bg-primary rounded-full"></div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic">NOS OFFRES SPÉCIALES</h2>
                                <div className="w-12 h-1 bg-white/10 rounded-full flex-grow mx-4 hidden md:block"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {offers.map(offer => (
                                    <motion.div 
                                        key={offer.id}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        onClick={() => {
                                            setSelectedOffer(offer);
                                            setIsOfferCustomizing(true);
                                        }}
                                        className="relative group cursor-pointer h-64 rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 shadow-2xl shadow-primary/5 transition-all"
                                    >
                                        <img src={offer.images && offer.images.length > 0 ? offer.images[0] : (offer.imagePath ? `https://api-production-48c5.up.railway.app${offer.imagePath}` : offer.imageUrl)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={offer.name} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                        <div className="absolute top-4 right-4 bg-primary text-black font-black px-4 py-1.5 rounded-full text-xs shadow-lg uppercase tracking-widest">
                                            PACK
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="text-2xl font-black uppercase text-white shadow-sm leading-tight italic tracking-tighter mb-1">{offer.name}</h3>
                                            <p className="text-slate-300 font-bold text-xs line-clamp-2 mb-4">{offer.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-black text-primary italic">€{parseFloat(offer.price).toFixed(2)}</span>
                                                <div className="w-10 h-10 bg-white/10 group-hover:bg-primary group-hover:text-black rounded-full flex items-center justify-center transition-all backdrop-blur-sm">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Category selection */}
                    <div className="flex items-center gap-4 mb-8 mt-12">
                        <div className="w-8 h-1 bg-primary rounded-full"></div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic">LA CARTE</h2>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-8 mask-fade scrollbar-hide">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`flex items-center gap-3 px-8 py-5 rounded-full font-black uppercase text-xs tracking-widest transition-all whitespace-nowrap border ${activeCategory === 'all' ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(255,106,0,0.4)]' : 'bg-transparent text-slate-500 hover:text-white border-white/20'}`}
                        >
                            <div className={`w-5 h-5 rounded-lg ${activeCategory === 'all' ? 'bg-black/20' : 'bg-white/10'}`} /> Toutes nos Recettes
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-3 px-8 py-5 rounded-full font-black uppercase text-xs tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat.id ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(255,106,0,0.4)]' : 'bg-transparent text-slate-500 hover:text-white border-white/20'}`}
                            >
                                <div className={`w-5 h-5 rounded-lg ${activeCategory === cat.id ? 'bg-black/20' : 'bg-white/10'}`} /> {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-32">
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((product) => (
                                <PizzaCard
                                    key={product.id}
                                    {...product}
                                    price={parseFloat(product.price)}
                                    basePrice={parseFloat(product.price)}
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

            {/* Customizers */}
            <PizzaCustomizer
                isOpen={isCustomizing}
                onClose={() => setIsCustomizing(false)}
                pizza={selectedPizza}
                toppings={toppings}
                onAddToCart={(customized) => {
                    addItem({
                        ...customized,
                        price: parseFloat(customized.price),
                        id: `${customized.id}-${Date.now()}`
                    });
                }}
            />

            <OfferCustomizer 
                isOpen={isOfferCustomizing}
                onClose={() => setIsOfferCustomizing(false)}
                offer={selectedOffer}
                products={products}
                categories={categories}
                onAddOfferToCart={(customized) => {
                    addOffer(customized);
                }}
            />

            <OrderModeModal 
                isOpen={isModeSelecting}
                onSelect={(mode) => {
                    setOrderMode(mode);
                    setIsModeSelecting(false);
                }}
            />

            <StoreClosedModal 
                isOpen={isStoreClosedModal}
                onSelectSlot={(slot) => {
                    // We could store this in the cart store as well
                    setIsStoreClosedModal(false);
                }}
            />
        </main>
    )
}
