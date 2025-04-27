import { prisma } from "@/lib/db"
import { ProductCard } from "@/components/product-card"
import { SearchFilters } from "@/components/search-filters"
import { SearchPagination } from "@/components/search-pagination"
import { Suspense } from "react"
import { SearchSkeleton } from "@/components/search-skeleton"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    id: string
  }
  searchParams: {
    sort?: string
    page?: string
    limit?: string
    condition?: string
  }
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Map category IDs to display names
  const categoryNames: Record<string, string> = {
    electronics: "Electronics",
    furniture: "Furniture",
    clothing: "Clothing",
    vehicles: "Vehicles",
    toys: "Toys & Games",
    sports: "Sports",
    books: "Books",
    jewelry: "Jewelry",
    home: "Home & Garden",
    beauty: "Beauty",
    music: "Music",
    art: "Art",
  }

  // Check if category exists
  if (!categoryNames[params.id]) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">{categoryNames[params.id]}</h1>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <SearchFilters currentCategory={params.id} />
        <div>
          <Suspense fallback={<SearchSkeleton />}>
            <CategoryResults params={params} searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function CategoryResults({ params, searchParams }: CategoryPageProps) {
  const category = params.id
  const sort = searchParams.sort || "newest"
  const page = Number.parseInt(searchParams.page || "1")
  const limit = Number.parseInt(searchParams.limit || "20")
  const condition = searchParams.condition
  const skip = (page - 1) * limit

  // Build where clause
  const where: any = {
    status: "AVAILABLE",
    category,
  }

  if (condition) {
    where.condition = condition
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
      user: true,
    },
    orderBy,
    skip,
    take: limit,
  })

  // Get total count
  const total = await prisma.product.count({ where })

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">No items found</h2>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {skip + 1}-{Math.min(skip + limit, total)} of {total} results
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <SearchPagination total={total} limit={limit} />
    </div>
  )
}
