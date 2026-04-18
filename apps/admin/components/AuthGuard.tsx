"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (pathname === "/login") {
            setAuthorized(true);
            return;
        }

        const token = localStorage.getItem("admin_token");
        const userStr = localStorage.getItem("admin_user");

        if (!token || !userStr) {
            router.push("/login");
        } else {
            const user = JSON.parse(userStr);
            if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
                router.push("/login");
            } else {
                setAuthorized(true);
            }
        }
    }, [pathname, router]);

    if (!authorized && pathname !== "/login") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                Verifying Credentials...
            </div>
        );
    }

    return <>{children}</>;
};
