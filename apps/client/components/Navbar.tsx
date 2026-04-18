"use client";

import Link from "next/link";
import axios from "axios";
import { ShoppingCart, Menu, X, User, CalendarDays, ShoppingBag, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "../store/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { CartDrawer } from "./CartDrawer";
import { Logo } from "./Logo";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    const token = localStorage.getItem("token");
    if (token) {
        axios.get("http://localhost:3002/api/v1/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
        }).catch(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        });
    }
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-500`}>
        <div className={`backdrop-blur-2xl border-2 rounded-full px-6 h-16 md:h-20 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all duration-500 ${scrolled ? 'bg-black border-primary scale-95' : 'bg-black/80 border-white/10'}`}>
          
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4 group">
                <Logo size="md" />
                <span className="text-lg md:text-2xl font-black tracking-tighter text-white uppercase italic">
                    SNACK BOX
                </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">OUVERT</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/menu" className="text-[10px] font-black tracking-widest hover:text-primary transition-colors uppercase text-white">MENU</Link>
            <Link href="/contact" className="text-[10px] font-black tracking-widest hover:text-primary transition-colors uppercase text-white">CONTACT</Link>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:border-primary/50 transition-all text-white">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">PRÉCOMMANDER</span>
            </button>
            
            <a href="tel:0643454235" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:scale-105 transition-all">
                <Phone className="w-4 h-4" /> 06 43 45 42 35
            </a>

            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-white/5 rounded-full border border-white/10 hover:border-primary/50 transition-all"
                >
                <ShoppingCart className="w-5 h-5 text-primary" />
                {mounted && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-black text-black">
                    {cartCount}
                    </span>
                )}
                </button>
                <Link href={mounted && user ? "/profile" : "/login"} className="btn-primary !px-5 !py-2.5 text-[10px] font-black italic tracking-widest">
                <span>{mounted && user?.firstName ? user.firstName.toUpperCase() : "CONNEXION"}</span>
                </Link>
            </div>
          </div>

          {/* Mobile Right */}
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-white/5 rounded-full border border-white/10">
                <ShoppingCart className="w-4 h-4 text-primary" />
                {mounted && cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-[8px] w-4 h-4 rounded-full flex items-center justify-center text-black font-bold">{cartCount}</span>}
            </button>
            <button className="p-2 text-white bg-white/5 rounded-full" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="lg:hidden mt-3 bg-black border-2 border-primary p-8 rounded-[2.5rem] flex flex-col gap-5 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-10 right-10 opacity-10 -rotate-12 pointer-events-none">
                        <Logo size="lg" />
                    </div>
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/menu" className="text-xl font-black italic text-white uppercase tracking-tighter hover:text-primary">MENU</Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/contact" className="text-xl font-black italic text-white uppercase tracking-tighter hover:text-primary">CONTACT</Link>
                    <div className="h-[1px] bg-white/10 my-2" />
                    <a href="tel:0643454235" className="flex items-center gap-3 text-primary font-black italic text-xl uppercase tracking-tighter"><Phone className="w-5 h-5" /> 06 43 45 42 35</a>
                    <Link onClick={() => setIsMobileMenuOpen(false)} href={mounted && user ? "/profile" : "/login"} className="btn-primary w-full text-lg mt-4">
                        {mounted && user ? "MON COMPTE" : "SE CONNECTER"}
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
