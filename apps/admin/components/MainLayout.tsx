"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { NotificationWrapper } from "./NotificationWrapper";
import { AuthGuard } from "./AuthGuard";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    return (
        <AuthGuard>
            <NotificationWrapper>
                <div className="flex bg-[var(--admin-bg)] min-h-screen">
                    {!isLoginPage && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
                    <main 
                        className={`transition-all duration-300 ease-in-out ${
                            isLoginPage ? 'w-full' : isCollapsed ? 'flex-grow ml-20 p-10' : 'flex-grow ml-72 p-10'
                        }`}
                    >
                        {children}
                    </main>
                </div>
            </NotificationWrapper>
        </AuthGuard>
    );
};
