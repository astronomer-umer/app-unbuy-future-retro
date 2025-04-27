import { CategoryCard } from "@/components/category-card"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Browse Categories</h1>
      <Suspense fallback={<CategorySkeleton />}>
        <Categories />
      </Suspense>
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function Categories() {
  const categories = [
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "furniture", name: "Furniture", icon: "🛋️" },
    { id: "clothing", name: "Clothing", icon: "👕" },
    { id: "vehicles", name: "Vehicles", icon: "🚗" },
    { id: "toys", name: "Toys & Games", icon: "🧸" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "books", name: "Books", icon: "📚" },
    { id: "jewelry", name: "Jewelry", icon: "💍" },
    { id: "home", name: "Home & Garden", icon: "🏡" },
    { id: "beauty", name: "Beauty", icon: "💄" },
    { id: "music", name: "Music", icon: "🎵" },
    { id: "art", name: "Art", icon: "🎨" },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}
