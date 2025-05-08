import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
     adapter: PrismaAdapter(prisma),
     providers: [
          CredentialsProvider({
               name: "Credentials",
               credentials: {
                    email: { label: "Email", type: "text" },
                    password: { label: "Password", type: "password" },
               },
               async authorize(credentials) {
                    if (!credentials?.email || !credentials?.password) {
                         throw new Error("Missing email or password");
                    }

                    const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
                         throw new Error("Invalid email or password");
                    }

                    return { id: user.id, name: user.name, email: user.email };
               },
          }),
     ],
     pages: {
          signIn: "/login",
          error: "/login",
     },
     callbacks: {
          async session({ session, token }) {
               if (token) {
                    session.user.id = token.sub;
               }
               return session;
          },
          async jwt({ token, user }) {
               if (user) {
                    token.sub = user.id;
               }
               return token;
          },
     },
     session: {
          strategy: "jwt",
     },
};

// Ensure the callback route responds correctly
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
