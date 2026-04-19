"use client";

import { useCartStore } from "../../store/cart-store";
import { Navbar } from "../../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Truck, User, MapPin, ChevronRight, ShoppingBag, ShieldCheck, Zap, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { TimeSlotPicker } from "../../components/TimeSlotPicker";

declare global {
    interface Window {
        google: any;
    }
}

export default function CheckoutPage() {
    const { items, offers, getTotal, clearCart, errors, setErrors } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [deliveryZones, setDeliveryZones] = useState<any[]>([]);
    const [selectedZone, setSelectedZone] = useState<any>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        zipCode: "",
        city: "",
        instructions: ""
    });
    const router = useRouter();

    // Load Google Maps Script
    useEffect(() => {
        const initAutocomplete = () => {
            const input = document.getElementById("address-input") as HTMLInputElement;
            if (!input) return;
            const autocomplete = new window.google.maps.places.Autocomplete(input, {
                componentRestrictions: { country: "fr" },
                fields: ["address_components", "geometry"],
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) return;

                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setSelectedLocation({ lat, lng });

                let zip = "";
                let city = "";
                place.address_components?.forEach((comp: any) => {
                    if (comp.types.includes("postal_code")) zip = comp.long_name;
                    if (comp.types.includes("locality")) city = comp.long_name;
                });

                setFormData(prev => ({ 
                    ...prev, 
                    address: input.value, 
                    zipCode: zip, 
                    city: city 
                }));
            });
        };

        if (!window.google) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            script.onload = () => initAutocomplete();
        } else {
            initAutocomplete();
        }
    }, [formData.zipCode]);

    useEffect(() => {
        axios.get("https://api-production-48c5.up.railway.app/api/v1/delivery-zones").then(res => {
            setDeliveryZones(res.data.filter((z: any) => z.isActive));
        }).catch(err => console.error("Error fetching zones", err));
    }, []);

    // Strict validation on mount & when items or location change
    useEffect(() => {
        if (items.length > 0 || offers.length > 0) {
            axios.post("https://api-production-48c5.up.railway.app/api/v1/orders/validate-cart", {
                items: items.map(i => ({ 
                    productId: i.id, 
                    price: i.price, 
                    quantity: i.quantity, 
                    name: i.name 
                })),
                offers: offers.map(o => ({
                    offerId: o.offerId,
                    price: o.price,
                    quantity: o.quantity,
                    name: o.name,
                    customOptions: o.customOptions
                })),
                deliveryZoneId: selectedZone?.id,
                lat: selectedLocation?.lat,
                lng: selectedLocation?.lng,
                zipCode: formData.zipCode
            }).then(res => {
                if (!res.data.valid) {
                    setErrors(res.data.corrections);
                } else {
                    setErrors([]);
                }
            }).catch(console.error);
        }
    }, [items, offers, selectedLocation, formData.zipCode, selectedZone, setErrors]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (name === "city" || name === "zipCode") {
            const found = deliveryZones.find(z => 
                z.name.toLowerCase().includes(value.toLowerCase()) || 
                (value.length >= 2 && z.name.toLowerCase().includes(value.toLowerCase()))
            );
            setSelectedZone(found || null);
        }
    };

    const validateAndPay = async (method: string) => {
        if (!formData.address || !formData.phone || !formData.firstName) {
            setErrors(["Veuillez remplir toutes les informations obligatoires."]);
            return;
        }

        setLoading(true);
        setErrors([]);
        
        try {
            const token = localStorage.getItem("token");
            
            // 2. Create Order
            const orderRes = await axios.post("https://api-production-48c5.up.railway.app/api/v1/orders", {
                items: items.map(i => ({ 
                    productId: i.id, 
                    price: i.price, 
                    quantity: i.quantity, 
                    name: i.name,
                    toppings: i.toppings || []
                })),
                offers: offers.map(o => ({
                    offerId: o.offerId,
                    price: o.price,
                    quantity: o.quantity,
                    name: o.name,
                    options: JSON.stringify(o.customOptions || [])
                })),
                deliveryZoneId: selectedZone?.id,
                address: `${formData.address}, ${formData.zipCode} ${formData.city}`,
                instructions: formData.instructions,
                customerName: `${formData.firstName} ${formData.lastName}`,
                customerPhone: formData.phone,
                customerEmail: "",
                paymentMethod: method,
                paymentStatus: "PENDING",
                lat: selectedLocation?.lat,
                lng: selectedLocation?.lng,
                zipCode: formData.zipCode,
                isASAP: !selectedSlot,
                scheduledSlot: selectedSlot
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (method === "CASH") {
                clearCart();
                router.push(`/order-confirmation?id=${orderRes.data.id}`);
            } else {
                const payRes = await axios.post("https://api-production-48c5.up.railway.app/api/v1/payments/create-session", {
                    orderId: orderRes.data.id,
                    successUrl: `${window.location.origin}/order-confirmation?id=${orderRes.data.id}`,
                    cancelUrl: `${window.location.origin}/checkout`
                }, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                
                if (payRes.data.url) {
                    window.location.href = payRes.data.url;
                }
            }
        } catch (error: any) {
            console.error(error);
            setErrors([error.response?.data?.message || "Une erreur est survenue."]);
        } finally {
            setLoading(false);
        }
    };

    const deliveryFee = selectedZone?.fee || 0;
    const finalTotal = getTotal() + deliveryFee;

    if (items.length === 0 && offers.length === 0) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center p-6">
                <div className="text-center space-y-8">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 animate-pulse">
                        <ShoppingBag className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Votre Panier est vide</h1>
                    <Link href="/menu" className="btn-primary">RETOUR AU MENU</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white pt-40 pb-20 px-6">
            <Navbar />
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                
                {/* LEFT SIDE: ORDER STEPS & FORMS */}
                <div className="lg:col-span-7 space-y-12">
                    <div className="space-y-4">
                        <Link href="/menu" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            <ArrowLeft className="w-4 h-4" /> Continuer mes achats
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black uppercase italic italic tracking-tighter leading-none">VOTRE <span className="text-primary italic">TUNNEL</span></h1>
                    </div>

                    <AnimatePresence>
                        {errors.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/50 p-6 rounded-3xl flex items-start gap-4 mb-8"
                            >
                                <AlertCircle className="text-red-500 w-6 h-6 flex-shrink-0" />
                                <div className="space-y-2">
                                    <h5 className="text-red-500 font-bold uppercase text-xs tracking-widest">Action requise</h5>
                                    <ul className="text-xs text-red-500/80 list-disc list-inside">
                                        {errors.map((err: string, idx: number) => <li key={idx}>{err}</li>)}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-8">
                        {/* STEP 1: INFO */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#111] border border-white/5 rounded-[3rem] p-10 space-y-8"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black font-black">1</div>
                                <h3 className="text-2xl font-black uppercase italic">VOS COORDONNÉES</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="input-field" placeholder="Prénom" />
                                <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="input-field" placeholder="Nom" />
                            </div>
                            <input name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" placeholder="Téléphone" />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#111] border border-white/5 rounded-[3rem] p-10 space-y-8"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 font-black">2</div>
                                <h3 className="text-2xl font-black uppercase italic">LIEU DE LIVRAISON</h3>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Saisissez votre adresse complète</label>
                                <input 
                                    id="address-input"
                                    name="address" 
                                    value={formData.address} 
                                    onChange={handleInputChange} 
                                    className="input-field" 
                                    placeholder="Ex: 15 Rue de Paris, Lyon" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="input-field" placeholder="Code Postal" />
                                <input name="city" value={formData.city} onChange={handleInputChange} className="input-field" placeholder="Ville" />
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#111] border border-white/5 rounded-[3rem] p-10 space-y-8"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 font-black">3</div>
                                <h3 className="text-2xl font-black uppercase italic">RÈGLEMENT</h3>
                            </div>
                            <button onClick={() => validateAndPay("STRIPE")} disabled={loading || errors.length > 0} className="w-full btn-primary !h-20 !text-sm !rounded-3xl shadow-xl shadow-primary/20">
                                {loading ? "VALIDATION..." : "PAYER PAR CARTE"} <ChevronRight className="w-6 h-6" />
                            </button>
                            <button onClick={() => validateAndPay("CASH")} disabled={loading || errors.length > 0} className="w-full bg-white/5 border border-white/10 p-6 rounded-[2rem] font-black uppercase text-xs tracking-widest text-slate-400 hover:text-white transition-all">
                                PAYER À LA LIVRAISON
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* RIGHT SIDE: SUMMARY */}
                <div className="lg:col-span-5 sticky top-32">
                    <div className="bg-[#111] border border-white/5 rounded-[4rem] overflow-hidden">
                        <div className="p-12 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-2xl font-black uppercase italic italic">VOTRE COMMANDE</h2>
                            <span className="bg-primary text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{items.length + offers.length} ARTICLE(S)</span>
                        </div>

                        <div className="p-12 space-y-8">
                             <div className="flex justify-between items-center text-xl font-black uppercase italic">
                                <span>TOTAL</span>
                                <span className="text-4xl text-primary italic drop-shadow-glow">{finalTotal.toFixed(2)}€</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
