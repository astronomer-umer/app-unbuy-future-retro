import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

// Server-side auth function
export async function getSession() {
  return await getServerSession(authOptions)
}
