import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  category: {
    id: string
    name: string
    icon: string
  }
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <span className="text-4xl mb-2">{category.icon}</span>
          <h3 className="font-medium text-primary">{category.name}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}

export { CategoryCard }
export default CategoryCard
