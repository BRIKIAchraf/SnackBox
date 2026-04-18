"use client";

import { API_BASE, SOCKET_URL } from "../lib/api-config";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        let socket: ReturnType<typeof io> | null = null;
        try {
            socket = io(SOCKET_URL, {
                reconnectionAttempts: 3,
                timeout: 5000,
            });

            socket.on("connect", () => {
                console.log("Connected to Real-time Sync");
            });

            socket.on("connect_error", () => {
                // Backend offline - silent fail, no console spam
                socket?.disconnect();
            });

            const handleUpdate = () => {
                console.log("Sync signal received - Refreshing UI...");
                // Force a full location reload to reset all local states and axios fetches
                window.location.reload();
            };

            socket.on("menu_updated", handleUpdate);
            socket.on("categories_updated", handleUpdate);
            socket.on("zones_updated", handleUpdate);
            
            socket.on("order_status_updated", (data) => {
                console.log("Order status update:", data);
                router.refresh(); // Order updates can stay soft
            });
        } catch (e) {
            // Ignore connection errors
        }

        return () => {
            socket?.disconnect();
        };
    }, [router]);

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
