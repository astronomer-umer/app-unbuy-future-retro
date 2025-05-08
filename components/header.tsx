"use client";
import { useSession, signOut } from "next-auth/react";
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
import { useRouter } from "next/router";

export default function Header() {
  const { data: session } = useSession();
  const { isLoginPopupOpen, openLoginPopup, closeLoginPopup } = useLoginPopup();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" }); // Redirect to the homepage after logout
  };

  return (
    <header className="via-blue-100 from-lime-50 bg-gradient-to-br to-lime-100 shadow-xl text-lime-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="transition-all hover:scale-125 ">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 " />
            <h1 className="text-2xl font-bold">unBuy</h1>
          </Link>
        </div>
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
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={openLoginPopup}
                className="bg-lime-800 text-white py-1 px-2 rounded hover:bg-lime-600"
            >
                Login
            </button>
          )}
        </nav>
      </div>
      {isLoginPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeLoginPopup}
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