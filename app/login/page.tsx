"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function LoginPopup({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleProviderLogin = async (provider: string) => {
    const result = await signIn(provider, { redirect: false });
    if (result?.error) {
      console.error("Login error:", result.error);
      alert("Login failed. Please try again.");
    } else if (result?.ok) {
      window.location.href = result.url || "/dashboard"; // Redirect to dashboard after login
    }
  };

  const handleSignUpRedirect = () => {
    window.location.href = "/register"; // Redirect to the registration page
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-in logic here
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-lime-800 bg-opacity-30"
        onClick={onClose} // Close modal when clicking outside
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-bl from-lime-200 via-lime-100 to-blue-200 p-6 rounded-lg shadow-lg relative w-full max-w-md"
      >
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-blue-800 text-base font-bold hover:text-lime-700"
        >
          ✕
        </button>
        <h1 className="text-2xl font-bold text-lime-900 mb-2">Sign in to your account</h1>
        <div className="py-3 px-10">

          <div className="text-center">
            {/* <p className="text-sm text-lime-900">Or sign in with your email:</p> */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-left font-bold  text-lime-900">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-lime-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-left font-bold  text-lime-900">Password:</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-lime-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-2 mt-4 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </form>
            <div className="mt-6 space-y-2">
              <button
                onClick={() => handleProviderLogin("google")}
                className="w-full bg-lime-800 text-white py-1 px-2 rounded hover:bg-lime-600"
              >
                Sign in with Google
              </button>
              <button
                onClick={() => handleProviderLogin("instagram")}
                className="w-full bg-lime-800 text-white py-1 px-2 rounded hover:bg-lime-600"
              >
                Sign in with Instagram
              </button>
              <button
                onClick={() => handleProviderLogin("microsoft")}
                className="w-full bg-lime-800 text-white py-1 px-2 rounded hover:bg-lime-600"
              >
                Sign in with Microsoft
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-lime-900">Don't have an account?</p>
              <button
                onClick={handleSignUpRedirect}
                className="text-blue-500 underline hover:text-blue-700"
              >
                Sign Up
              </button>
            </div>
          </div></div>
      </motion.div>
    </div>
  );
}
