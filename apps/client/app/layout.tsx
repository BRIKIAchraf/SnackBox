import type { Metadata } from "next";
import { MainLayout } from "../components/MainLayout";
import { GoogleBadge } from "../components/GoogleBadge";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snack Box District - Gourmet Experience",
  description: "The best premium pizza and tacos delivery in town.",
  icons: {
    icon: '/favicon.ico',
  }
};

import QueryProvider from "../providers/QueryProvider";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <QueryProvider>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#121215',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1rem',
                fontSize: '13px',
                fontWeight: 'bold',
              }
            }}
          />
          <MainLayout>
            {children}
          </MainLayout>
        </QueryProvider>
        <GoogleBadge />
      </body>
    </html>
  );
}
