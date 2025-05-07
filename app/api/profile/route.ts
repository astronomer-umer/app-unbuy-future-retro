import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
     const session = await getSession();

     if (!session?.user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }

     const { image, location } = await request.json();

     try {
          await prisma.user.update({
               where: { id: session.user.id },
               data: { image, location },
          });

          return NextResponse.json({ success: true });
     } catch (error) {
          return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
     }
}