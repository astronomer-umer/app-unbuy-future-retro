import { Suspense } from "react"
import { prisma } from "@/lib/db"
import { ProductCard } from "@/components/product-card"
import { SearchFilters } from "@/components/search-filters"
import { SearchPagination } from "@/components/search-pagination"
import { SearchSkeleton } from "@/components/search-skeleton"

interface SearchPageProps {
  searchParams: {
    query?: string
    category?: string
    sort?: string
    page?: string
    limit?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        {searchParams.query
          ? `Search results for "${searchParams.query}"`
          : searchParams.category
            ? `Browse ${searchParams.category}`
            : "Browse all items"}
      </h1>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <SearchFilters />
        <div>
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const query = searchParams.query || ""
  const category = searchParams.category || ""
  const sort = searchParams.sort || "newest"
  const page = Number.parseInt(searchParams.page || "1")
  const limit = Number.parseInt(searchParams.limit || "20")
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
