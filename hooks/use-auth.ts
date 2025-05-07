"use client"

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const user = session?.user

  const signIn = async (provider: string, options?: Record<string, any>) => {
    return await nextAuthSignIn(provider, {
      ...options,
      redirect: false, // Ensure no redirection occurs
    });
  };

  const signOut = async () => {
    setIsLoading(true)
    try {
      await nextAuthSignOut({ redirect: false })
      router.push("/")
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    status,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    updateSession: update,
  }
}
