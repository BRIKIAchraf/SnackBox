"use client";

import { User, Package, MapPin, LogOut, ChevronRight, Settings, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  user: any;
  onLogout: () => void;
}

export const ProfileSidebar = ({ activeTab, setActiveTab, user, onLogout }: ProfileSidebarProps) => {
  const menuItems = [
    { id: "orders", label: "Mes Commandes", icon: Package, description: "Historique et suivi" },
    { id: "addresses", label: "Adresses", icon: MapPin, description: "Gérer vos lieux de livraison" },
    { id: "profile", label: "Informations", icon: User, description: "Détails du compte" },
    { id: "settings", label: "Paramètres", icon: Settings, description: "Sécurité et préférences" },
  ];

  return (
    <div className="w-full lg:w-80 flex flex-col gap-8">
      {/* User Card */}
      <div className="bg-[#121215] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-[1.8rem] bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white text-3xl font-black italic shadow-2xl border border-white/10 group-hover:rotate-6 transition-transform duration-500">
            {user?.firstName?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">
                    {user?.firstName}
                </h3>
                <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">Client Premium</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
            <div className="text-center">
                <p className="text-lg font-black text-white">12</p>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Commandes</p>
            </div>
            <div className="w-[1px] h-8 bg-white/5" />
            <div className="text-center">
                <p className="text-lg font-black text-white">450</p>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Points</p>
            </div>
            <div className="w-[1px] h-8 bg-white/5" />
            <div className="text-center">
                <p className="text-lg font-black text-white">2</p>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Adresses</p>
            </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`group flex items-center justify-between p-5 rounded-[1.8rem] transition-all duration-500 border ${
              activeTab === item.id
                ? "bg-primary border-primary text-black shadow-[0_20px_40px_rgba(255,106,0,0.2)] scale-[1.02]"
                : "bg-[#121215]/50 border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#121215]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${
                activeTab === item.id ? "bg-black/10" : "bg-white/5 group-hover:bg-primary/10 transition-colors"
              }`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className={`text-xs font-black uppercase tracking-widest ${activeTab === item.id ? "text-black" : "text-white"}`}>
                    {item.label}
                </p>
                <p className={`text-[9px] font-bold opacity-60 ${activeTab === item.id ? "text-black" : "text-slate-500"}`}>
                    {item.description}
                </p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${activeTab === item.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} />
          </button>
        ))}

        <button 
          onClick={onLogout}
          className="mt-4 flex items-center gap-4 p-5 rounded-[1.8rem] text-red-500 bg-red-500/5 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-500 font-black uppercase text-xs tracking-widest"
        >
          <div className="p-3 rounded-2xl bg-red-500/10 group-hover:bg-white/20">
            <LogOut className="w-5 h-5" />
          </div>
          Déconnexion
        </button>
      </nav>
    </div>
  );
};
