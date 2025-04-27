import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth-options"

// This is for client components only
export const { signIn, signOut } = NextAuth(authOptions)

// Export auth for server components
export const auth = async () => {
  return await NextAuth(authOptions).auth()
}
