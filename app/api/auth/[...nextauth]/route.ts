import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

// Ensure the callback route responds correctly
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
