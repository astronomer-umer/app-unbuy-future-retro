import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth-options"

// Create a handler with the full auth options
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
