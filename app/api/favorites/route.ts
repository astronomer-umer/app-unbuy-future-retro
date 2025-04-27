import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { productId } = await request.json()

    // Validate input
    if (!productId) {
      return NextResponse.json({ message: "Missing product ID" }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    })

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json({ message: "Product already in favorites" }, { status: 409 })
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    })

    return NextResponse.json({ message: "Product added to favorites", favorite }, { status: 201 })
  } catch (error) {
    console.error("Favorite creation error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { productId } = await request.json()

    // Validate input
    if (!productId) {
      return NextResponse.json({ message: "Missing product ID" }, { status: 400 })
    }

    // Delete favorite
    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    return NextResponse.json({ message: "Product removed from favorites" }, { status: 200 })
  } catch (error) {
    console.error("Favorite deletion error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
