"use client";

import type React from "react";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SessionProvider } from "@/components/session-provider";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); // Simulated loading delay
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <html lang="en">
        <body className="preloader-container">
          <div className="preloader-content">
            <img src="/logo.png" alt="Unbuy Logo" className="logo" />
            <h1 className="brand-title">unBuy</h1>
            <p className="brand-tagline">Where Pre-loved Meets Re-loved.</p>
            <div className="loader"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen flex flex-col ${inter.className}`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex flex-col flex-grow">
              <Header />
              <main className="flex-1 p-6">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
