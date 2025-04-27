"use client"

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const user = session?.user

  const signIn = async (provider: string, credentials?: Record<string, string>, callbackUrl?: string) => {
    setIsLoading(true)
    try {
      if (provider === "credentials" && credentials) {
        return await nextAuthSignIn("credentials", {
          redirect: false,
          ...credentials,
        })
      }
      return await nextAuthSignIn(provider, {
        callbackUrl: callbackUrl || "/dashboard",
        redirect: provider !== "credentials",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
