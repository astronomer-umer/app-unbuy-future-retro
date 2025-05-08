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

  const handleForgotPassword = () => {
    window.location.href = "/forgot-password"; // Redirect to the forgot password page
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
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-blue-800 text-base font-bold hover:text-lime-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Sign In</h2>
        <div className="space-y-4">
          <button
            onClick={() => handleProviderLogin("google")}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => handleProviderLogin("microsoft")}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Sign in with Microsoft
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-lime-900">Forgot your password?</p>
          <button
            onClick={handleForgotPassword}
            className="text-blue-500 underline hover:text-blue-700"
          >
            Reset Password
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
      </motion.div>
    </div>
  );
}
