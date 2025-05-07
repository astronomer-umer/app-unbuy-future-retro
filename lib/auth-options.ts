import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client" // Fix TS2305: Use PrismaClient instance
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import InstagramProvider from "next-auth/providers/instagram"
import AzureADProvider from "next-auth/providers/azure-ad"
import bcrypt from "bcryptjs"
import type { NextAuthOptions, Session } from "next-auth"
import type { Adapter } from "next-auth/adapters"

// Initialize Prisma client
const prismaClient = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClient) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
        },
      },
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID || "",
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || "",
    }),
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID || "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
      tenantId: process.env.MICROSOFT_TENANT_ID || "common",
    }),
    CredentialsProvider({
      // Remove 'name' to fix TS2353; use default config
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials")
          }
          const user = await prismaClient.user.findUnique({
            where: { email: credentials.email },
          })
          if (!user || !user.password) {
            throw new Error("User not found or no password set")
          }
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (!isPasswordValid) {
            throw new Error("Invalid password")
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Credentials authorize error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      try {
        if (token.sub && session.user) {
          session.user.id = token.sub
        }
        return session
      } catch (error) {
        console.error("Session callback error:", error)
        return session
      }
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      try {
        if (user) {
          token.id = user.id
        }
        return token
      } catch (error) {
        console.error("JWT callback error:", error)
        return token
      }
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      try {
        // Allow only internal redirects
        if (url.startsWith(baseUrl)) {
          return url;
        }
        return baseUrl;
      } catch (error) {
        console.error("Redirect callback error:", error);
        return baseUrl;
      }
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: true,
  logger: {
    error(code: unknown, metadata: unknown) {
      console.error("AUTH_ERROR:", code, metadata)
    },
    warn(code: unknown) {
      console.warn("AUTH_WARN:", code)
    },
    debug(code: unknown, metadata: unknown) {
      console.debug("AUTH_DEBUG:", code, metadata)
    },
  },
}