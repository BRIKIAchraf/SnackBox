"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "./Footer";
import { SOCKET_URL } from "../lib/api-config";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const queryClient = useQueryClient();

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
                toast.success("Le menu a été mis à jour !", {
                    icon: '🍕',
                    duration: 4000
                });
                queryClient.invalidateQueries();
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
                    toast(statusMessages[data.status], {
                        icon: data.status === 'CANCELLED' ? '❌' : '🔔',
                        duration: 6000
                    });
                    new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(() => {});
                }
                queryClient.invalidateQueries({ queryKey: ['orders'] });
            });
        } catch (e) {
            console.error("Socket connection failed", e);
        }

        return () => {
            socket?.disconnect();
        };
    }, [router, queryClient]);

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
            </motion.div>
        </AnimatePresence>
    );
};
