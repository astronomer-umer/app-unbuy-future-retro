import { Suspense } from "react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/db"
import ProductCard from "@/components/product-card"
import CategoryCard from "@/components/category-card"
import ProductCardSkeleton from "@/components/product-card-skeleton"

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Fetch featured products
  const featuredProducts = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  })

  // Define categories
  const categories = [
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "furniture", name: "Furniture", icon: "🛋️" },
    { id: "clothing", name: "Clothing", icon: "👕" },
    { id: "vehicles", name: "Vehicles", icon: "🚗" },
    { id: "toys", name: "Toys & Games", icon: "🧸" },
    { id: "sports", name: "Sports", icon: "⚽" },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-primary text-white rounded-lg p-8 mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Find, Buy, Sell</h1>
        <p className="text-xl mb-6">Your one-stop marketplace for all your needs</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/search" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-medium">
            Browse Listings
          </Link>
          {!session ? (
            <Link
              href="/login"
              className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-md font-medium"
            >
              Sign In to Sell
            </Link>
          ) : (
            <Link
              href="/sell"
              className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-md font-medium"
            >
              Sell Something
            </Link>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
          <Link href="/categories" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Listings</h2>
          <Link href="/search" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Suspense>
      </section>
    </main>
  )
}
