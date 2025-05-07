import { CategoryCard } from "@/components/category-card"
import { prisma } from "@/lib/db"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
    },
  })

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Browse Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
