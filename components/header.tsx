"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SearchBox from "@/components/search-box";
import LoginPopup from "@/app/login/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLoginPopup } from "@/hooks/use-LoginPopup";

export default function Header() {
  const { data: session } = useSession();
  const { isLoginPopupOpen, openLoginPopup, closeLoginPopup, handleClosePopup } = useLoginPopup();

  return (
    <header className="via-blue-100 from-lime-50 bg-gradient-to-br to-lime-100 shadow-xl text-lime-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="transition-all hover:scale-125 ">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 " />
            <h1 className="text-2xl font-bold">unBuy</h1>
          </Link></div>
        <SearchBox />
        <nav className="hidden md:flex gap-4">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || "/placeholder-user.jpg"} alt={session.user.name || "User"} />
                  <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={openLoginPopup}
              className="hover:bg-blue-50 text-lime-900 transition-all hover:text-blue-900 p-2 rounded-md font-medium duration-500 flex items-center gap-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A10.97 10.97 0 0112 15c2.21 0 4.21.636 5.879 1.804M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Sign in
            </button>
          )}
        </nav>
      </div>
      {isLoginPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClosePopup}
        >
          <div className="relative bg-white p-6 rounded-lg shadow-lg popup-content">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLoginPopup();
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-all"
            >
              ✖
            </button>
            <LoginPopup onClose={closeLoginPopup} />
          </div>
        </div>
      )}
    </header>
  );
}