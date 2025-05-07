"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LoginPopup from "@/app/login/page";
import { useLoginPopup } from "@/hooks/use-LoginPopup";

export default function SellButton() {
  const { data: session } = useSession();
  const { isLoginPopupOpen, openLoginPopup, closeLoginPopup, handleClosePopup } = useLoginPopup();

  return (
    <>
      {session ? (
        <Link
          href="/sell"
          className="bg-lime-300 hover:bg-blue-100 text-lime-900 shadow-inner shadow-blue-300 hover:shadow-lime-500 transition-all hover:text-blue-900 px-6 py-3 rounded-md font-medium duration-500"
        >
          Sell Something
        </Link>
      ) : (
        <button
          onClick={openLoginPopup}
          className="bg-lime-300 hover:bg-blue-100 text-lime-900 shadow-inner shadow-blue-300 hover:shadow-lime-500 transition-all hover:text-blue-900 px-6 py-3 rounded-md font-medium duration-500"
        >
          Sell Something
        </button>
      )}
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
    </>
  );
}