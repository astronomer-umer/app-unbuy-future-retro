import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { SessionProvider } from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export const metadata: Metadata = {
  title: "UB - Buy & Sell Locally",
  description: "A modern platform for buying and selling items locally",
  keywords: ["marketplace", "buy", "sell", "local", "secondhand", "ecommerce"],
  authors: [{ name: "UB Team" }],
  creator: "UB",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "UB - Buy & Sell Locally",
    description: "A modern platform for buying and selling items locally",
    siteName: "UB",
  },
  twitter: {
    card: "summary_large_image",
    title: "UB - Buy & Sell Locally",
    description: "A modern platform for buying and selling items locally",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
