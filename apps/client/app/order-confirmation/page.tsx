"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { CheckCircle, Package, Truck, Pizza, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { API_BASE } from "../../lib/api-config";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (orderId) {
      axios.get(`${API_BASE}/orders/${orderId}`).then(res => {
        setOrder(res.data);
      });
      // Polling every 5 seconds for status updates
      const interval = setInterval(() => {
          axios.get(`${API_BASE}/orders/${orderId}`).then(res => {
            setOrder(res.data);
          });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const isPendingPayment = order?.status === "PENDING_PAYMENT";

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <Navbar />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="mb-12 relative flex justify-center">
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", damping: 12, delay: 0.2 }}
               className={`w-32 h-32 ${isPendingPayment ? 'bg-orange-500' : 'bg-green-500'} rounded-full flex items-center justify-center shadow-2xl`}
            >
                {isPendingPayment ? <Pizza className="w-16 h-16 text-white animate-spin" /> : <CheckCircle className="w-16 h-16 text-white" />}
            </motion.div>
        </div>

        <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase italic">
            {isPendingPayment ? "En attente de paiement..." : "Commande Confirmée !"}
        </h1>
        <p className="text-white/60 text-lg font-medium mb-12">
            {isPendingPayment ? "Nous attendons la confirmation de votre banque." : "Votre pizza est en cours de préparation par nos chefs experts."} <br/>
            Référence : <span className="text-white font-mono tracking-widest uppercase">#{orderId?.slice(0, 8) || "XXXXXX"}</span>
        </p>

        {!isPendingPayment && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
               <div className={`glass-card p-6 flex flex-col items-center gap-3 ${order?.status === "PAID" || order?.status === "CONFIRMED" ? 'border-primary' : ''}`}>
                   <Package className={`w-6 h-6 ${order?.status === "PAID" || order?.status === "CONFIRMED" ? 'text-primary' : 'text-slate-600'}`} />
                   <span className="text-[10px] font-black tracking-[0.2em] uppercase">Confirmée</span>
               </div>
               <div className={`glass-card p-6 flex flex-col items-center gap-3 ${order?.status === "IN_PREPARATION" ? 'border-primary' : ''}`}>
                   <Pizza className={`w-6 h-6 ${order?.status === "IN_PREPARATION" ? 'text-primary' : 'text-slate-600'}`} />
                   <span className="text-[10px] font-black tracking-[0.2em] uppercase">Préparation</span>
               </div>
               <div className={`glass-card p-6 flex flex-col items-center gap-3 ${order?.status === "DELIVERING" ? 'border-primary' : ''}`}>
                   <Truck className={`w-6 h-6 ${order?.status === "DELIVERING" ? 'text-primary' : 'text-slate-600'}`} />
                   <span className="text-[10px] font-black tracking-[0.2em] uppercase">Livraison</span>
               </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
                onClick={() => router.push("/")}
                className="btn-primary !px-10 flex items-center justify-center gap-2"
            >
                RETOUR À L'ACCUEIL <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </motion.div>
    </main>
  );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-primary font-black uppercase italic tracking-widest">Initialisation...</div>}>
            <OrderConfirmationContent />
        </Suspense>
    );
}
