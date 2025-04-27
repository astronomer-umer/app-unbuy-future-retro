"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Menu, Search, Heart, MessageSquare, User, LogOut, Settings } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            LetGo Clone
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-6">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full py-2 px-4 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/search" className={`hover:text-gray-200 ${pathname === "/search" ? "font-bold" : ""}`}>
              Browse
            </Link>

            {session ? (
              <>
                <Link href="/sell" className={`hover:text-gray-200 ${pathname === "/sell" ? "font-bold" : ""}`}>
                  Sell
                </Link>
                <Link
                  href="/favorites"
                  className={`hover:text-gray-200 ${pathname === "/favorites" ? "font-bold" : ""}`}
                >
                  <Heart size={20} />
                </Link>
                <Link href="/messages" className={`hover:text-gray-200 ${pathname === "/messages" ? "font-bold" : ""}`}>
                  <MessageSquare size={20} />
                </Link>
                <div className="relative group">
                  <button className="flex items-center hover:text-gray-200">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Signed in as <span className="font-medium">{session.user?.name || session.user?.email}</span>
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={16} className="inline mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded-md">
                  Sign In
                </Link>
                <Link href="/register" className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-md">
                  Register
                </Link>
              </>
            )}
            <ModeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <ModeToggle />
            <button onClick={toggleMenu} className="ml-4 text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search - Visible only on mobile */}
        <div className="mt-4 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full py-2 px-4 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>
                  Browse
                </Link>
              </li>

              {session ? (
                <>
                  <li>
                    <Link href="/sell" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>
                      Sell
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/favorites"
                      className="block py-2 hover:text-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Favorites
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/messages"
                      className="block py-2 hover:text-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Messages
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="block py-2 hover:text-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/settings"
                      className="block py-2 hover:text-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" })
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left py-2 hover:text-gray-200"
                    >
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="block py-2 hover:text-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
