import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
     const { searchParams } = new URL(request.url);
     const userId = searchParams.get("userId");

     if (!userId) {
          return NextResponse.json({ error: "Missing userId" }, { status: 400 });
     }

     const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
               id: true,
               name: true,
               email: true,
               image: true,
          },
     });

     if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
     }

     return NextResponse.json({ user });
}