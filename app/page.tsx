import { Suspense } from "react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/db"
import ProductCard from "@/components/product-card"
import CategoryCard from "@/components/category-card"
import ProductCardSkeleton from "@/components/product-card-skeleton"
import SellButton from "@/components/SellButton"

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

  // Fetch categories dynamically
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
    },
  })

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Hero Section */}
      <section className="bg-primary bg-gradient-to-tr to-blue-400 via-blue-900 from-lime-900 text-white rounded-lg p-8 mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Where Pre-loved Meets Re-loved.</h1>
        <p className="text-xl mb-6">Find, buy or sell anything, anytime, anywhere!</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/search" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-medium">
            Browse Stuff
          </Link>
          <SellButton />
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12 mx-6 px-6 py-6 bg-gradient-to-b to-lime-50 from-lime-100 shadow-xl ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Link href="/categories" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-12 mx-6 px-6 py-6 bg-gradient-to-b to-lime-50 from-lime-100 shadow-xl ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured</h2>
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
