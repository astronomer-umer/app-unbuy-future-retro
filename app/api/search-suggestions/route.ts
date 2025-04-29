import { prisma } from "@/lib/db"

export async function GET(request: Request) {
     const { searchParams } = new URL(request.url)
     const query = searchParams.get("query") || ""

     if (!query) {
          return new Response(JSON.stringify({ suggestions: [] }), { status: 200 })
     }

     const suggestions = await prisma.product.findMany({
          where: {
               OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
               ],
          },
          select: {
               id: true,
               title: true,
          },
          take: 5, // Limit the number of suggestions
     })

     return new Response(JSON.stringify({ suggestions: suggestions.map((s) => ({ id: s.id, name: s.title })) }), {
          status: 200,
     })
}