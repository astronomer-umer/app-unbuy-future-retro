import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET() {
  // Use getServerSession with the full auth options
  const session = await getServerSession(authOptions)

  return NextResponse.json({
    authenticated: !!session,
    session: session
      ? {
          user: {
            id: session.user?.id,
            name: session.user?.name,
            email: session.user?.email,
          },
        }
      : null,
    timestamp: new Date().toISOString(),
  })
}
