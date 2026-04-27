import type { Metadata } from "next";
import { MainLayout } from "../components/MainLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snack Box Admin",
  icons: {
    icon: '/favicon.ico',
  }
};

import QueryProvider from "../providers/QueryProvider";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans bg-[#050505]">
        <QueryProvider>
          <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#121215',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '1rem',
                }
              }}
          />
          <MainLayout>
            {children}
          </MainLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
