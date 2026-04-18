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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <MainLayout>
          {children}
        </MainLayout>
        <GoogleBadge />
      </body>
    </html>
  );
}
