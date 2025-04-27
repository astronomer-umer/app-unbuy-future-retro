import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart } from "lucide-react"

export default async function DashboardFavoritesPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/favorites")
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: {
        include: {
          images: {
            take: 1,
          },
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <ProductCard key={favorite.id} product={favorite.product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            <Heart className="h-10 w-10 text-secondary" />
          </div>
          <h2 className="text-xl font-semibold">No favorites yet</h2>
          <p className="text-muted-foreground mt-2">
            Browse items and add them to your favorites to keep track of things you like.
          </p>
          <Button asChild className="mt-4">
            <Link href="/categories">Browse Items</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
