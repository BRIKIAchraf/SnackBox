import type { Metadata } from "next";
import { MainLayout } from "../components/MainLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snack Box Admin",
  icons: {
    icon: '/favicon.ico',
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
