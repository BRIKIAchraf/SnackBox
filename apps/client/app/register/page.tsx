"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.push("/login"); // Now the unified Auth Page
    }, [router]);

    return (
        <main className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-pulse text-primary font-black uppercase tracking-widest text-3xl italic">Redirection vers le Club...</div>
        </main>
    );
}
