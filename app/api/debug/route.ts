import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    nextauth_url: process.env.NEXTAUTH_URL,
    node_env: process.env.NODE_ENV,
    database_url_exists: !!process.env.DATABASE_URL,
    google_client_id_exists: !!process.env.GOOGLE_CLIENT_ID,
    timestamp: new Date().toISOString(),
  })
}
