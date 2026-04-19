"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "./Footer";
import { SOCKET_URL } from "../lib/api-config";
import { ToastContainer, ToastType } from "./Toast";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [toasts, setToasts] = useState<any[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    useEffect(() => {
        let socket: any = null;
        try {
            socket = io(SOCKET_URL, {
                reconnectionAttempts: 3,
                timeout: 5000,
            });

            socket.on("connect", () => {
                console.log("Connected to Real-time Sync");
            });

            socket.on("menu_updated", () => {
                addToast("Le menu a été mis à jour !", "info");
                setTimeout(() => window.location.reload(), 2000);
            });
            
            socket.on("order_status_updated", (data: any) => {
                const statusMessages: Record<string, string> = {
                    'CONFIRMED': 'Votre commande est confirmée !',
                    'IN_PREPARATION': 'Votre commande est en préparation 👨‍🍳',
                    'READY': 'Votre commande est prête ! 🍕',
                    'DELIVERING': 'Votre commande est en chemin ! 🛵',
                    'COMPLETED': 'Commande livrée. Bon appétit !',
                    'CANCELLED': 'Votre commande a été annulée.'
                };
                
                if (statusMessages[data.status]) {
                    addToast(statusMessages[data.status], data.status === 'CANCELLED' ? "error" : "order");
                    new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(() => {});
                }
                router.refresh();
            });
        } catch (e) {
            console.error("Socket connection failed", e);
        }

        return () => {
            socket?.disconnect();
        };
    }, [router, addToast]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {children}
                <Footer />
                <ToastContainer toasts={toasts} removeToast={removeToast} />
            </motion.div>
        </AnimatePresence>
    );
};
