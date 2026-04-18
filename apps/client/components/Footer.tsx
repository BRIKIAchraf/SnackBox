"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { ChevronRight, Utensils, ShieldCheck, Phone, Mail, MapPin, Camera, Globe, Send } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="px-6 pb-20 mt-0 bg-[#050505]">
      <div className="max-w-7xl mx-auto rounded-[4rem] overflow-hidden relative border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
        {/* Image de fond */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover grayscale opacity-60"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        {/* Ligne lumineuse en haut */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-10" />

        <div className="relative z-10">
          {/* Section CTA */}
          <div className="pt-24 pb-20 text-center px-6 border-b border-white/5">
            {/* Logo grande taille centrée */}
            <div className="flex justify-center mb-8">
              <Logo size="xl" />
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-white mb-10">
              REJOIGNEZ <br />
              <span className="text-primary italic">LA SNACK BOX</span>
            </h2>
            <Link
              href="/menu"
              className="btn-primary !px-16 !py-8 text-xl !rounded-full shadow-[0_20px_40px_rgba(255,102,0,0.3)] inline-flex transition-transform hover:scale-105"
            >
              COMMANDER MAINTENANT <ChevronRight className="w-8 h-8" />
            </Link>
          </div>

          {/* Liens du Footer */}
          <div className="max-w-6xl mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-12 py-16">
            {/* Marque */}
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-4">
                <Logo size="md" />
                <span className="text-2xl font-black italic uppercase text-white">Snack Box</span>
              </div>
              <p className="max-w-md text-slate-300 font-bold text-base italic leading-relaxed">
                "Le meilleur de la Street-Food gourmet, livré directement chez vous."
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                  <Camera className="w-4 h-4 text-slate-400 group-hover:text-black" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                  <Globe className="w-4 h-4 text-slate-400 group-hover:text-black" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                  <Send className="w-4 h-4 text-slate-400 group-hover:text-black" />
                </a>
              </div>
            </div>

            {/* Liens de navigation */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">NAVIGATION</h4>
              {[
                { label: "Accueil", href: "/" },
                { label: "Menu", href: "/menu" },
                { label: "Contact", href: "/contact" },
                { label: "Mon compte", href: "/profile" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm group">
                  <ChevronRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">CONTACT</h4>
              <a href="tel:0643454235" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors font-bold text-sm group">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                06 43 45 42 35
              </a>
              <a href="mailto:hello@snackbox.fr" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors font-bold text-sm group">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                hello@snackbox.fr
              </a>
              <div className="flex items-start gap-3 text-slate-400 font-bold text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                124 Rue du Burger<br />Quartier Snackbox
              </div>
            </div>
          </div>

          {/* Droits d'auteur */}
          <div className="mx-10 md:mx-20 py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
              © 2026 SNACK BOX GOURMET • FAIT AVEC PASSION
            </p>
            <div className="flex gap-4 items-center">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                QUALITÉ SNACK BOX CERTIFIÉE
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
