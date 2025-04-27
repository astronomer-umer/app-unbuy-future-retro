import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const senderId = session.user.id
    const { content, receiverId } = await request.json()

    // Validate input
    if (!content || !receiverId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    })

    if (!receiver) {
      return NextResponse.json({ message: "Receiver not found" }, { status: 404 })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error("Message creation error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
