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
    const { title, description, price, category, condition, location, images } = await request.json()

    // Validate input
    if (!title || !description || !price || !category || !condition) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        category,
        condition,
        location,
        userId,
        images: {
          create: images.map((url: string) => ({
            url,
          })),
        },
      },
      include: {
        images: true,
      },
    })

    return NextResponse.json({ message: "Product created successfully", product }, { status: 201 })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const query = searchParams.get("query")
    const sort = searchParams.get("sort") || "newest"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      status: "AVAILABLE",
    }

    if (category) {
      where.category = category
    }

    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ]
    }

    // Build orderBy
    let orderBy: any = {}
    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
      case "price_high":
        orderBy = { price: "desc" }
        break
      case "price_low":
        orderBy = { price: "asc" }
        break
      default:
        orderBy = { createdAt: "desc" }
    }

    // Get products
    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          take: 1,
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    })

    // Get total count
    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
