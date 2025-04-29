"use client"

import SearchBox from "@/components/search-box"
import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <img src="/icons/logo-3d.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold">unBuy</h1>
        </Link>
        <SearchBox />
        <nav className="hidden md:flex gap-4">
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <Link href="/help" className="hover:underline">
            Help Center
          </Link>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
