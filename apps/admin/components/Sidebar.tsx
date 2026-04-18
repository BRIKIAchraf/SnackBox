"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  Settings, 
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  ListRestart,
  Zap,
  ChevronLeft,
  ChevronRight,
  Utensils
} from "lucide-react";
import { Logo } from "./Logo";
import { motion, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Tableau de Bord", href: "/dashboard" },
  { icon: ShoppingBag, label: "Commandes", href: "/orders" },
  { icon: Utensils, label: "Menu", href: "/menu" },
  { icon: Zap, label: "Ingrédients", href: "/toppings" },
  { icon: Users, label: "Clients", href: "/customers" },
  { icon: MapPin, label: "Zones de Livraison", href: "/delivery-zones" },
  { icon: MessageSquare, label: "Messages", href: "/contact-messages" },
  { icon: ListRestart, label: "Journaux d'Audit", href: "/logs" },
  { icon: Settings, label: "Paramètres", href: "/settings" },
];

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (v: boolean) => void;
}

export const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside 
        className={`fixed inset-y-0 left-0 bg-[var(--admin-sidebar)] border-r border-[var(--admin-border)] flex flex-col transition-all duration-300 ease-in-out z-50 ${
            isCollapsed ? 'w-20' : 'w-72'
        }`}
    >
      {/* HEADER / LOGO */}
      <div className={`flex items-center gap-4 py-8 mb-4 overflow-hidden h-24 ${isCollapsed ? 'justify-center px-0' : 'px-8'}`}>
        <div className="flex-shrink-0">
            <Logo size="sm" />
        </div>
        {!isCollapsed && (
            <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-black italic tracking-tighter uppercase whitespace-nowrap"
            >
                SNACK BOX
            </motion.span>
        )}
      </div>

      {/* TOGGLE BUTTON */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[var(--primary)] text-white rounded-full flex items-center justify-center border-2 border-[var(--admin-sidebar)] hover:scale-110 transition-transform shadow-lg z-[60]"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* NAVIGATION */}
      <nav className={`flex-grow space-y-2 custom-scrollbar overflow-y-auto px-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`sidebar-link w-full group relative ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center !px-0 !w-12 !h-12' : ''}`}
              title={isCollapsed ? item.label : ""}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[var(--primary)]' : 'text-slate-400 group-hover:text-white'}`} />
              {!isCollapsed && (
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-black text-[10px] uppercase tracking-widest truncate"
                >
                    {item.label}
                </motion.span>
              )}
              {isCollapsed && isActive && (
                  <motion.div layoutId="active-pill" className="absolute -left-4 w-1 h-6 bg-[var(--primary)] rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* PIED DE PAGE */}
      <div className={`py-6 border-t border-[var(--admin-border)] ${isCollapsed ? 'flex justify-center' : 'px-4'}`}>
        <button 
          onClick={() => {
            localStorage.removeItem("admin_token");
            window.location.href = "/login";
          }}
          className={`flex items-center gap-3 w-full rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest ${isCollapsed ? 'justify-center !w-12 !h-12 !px-0' : 'px-4 py-3'}`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};
