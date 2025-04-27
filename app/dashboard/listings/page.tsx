import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default async function ListingsPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/listings")
  }

  const products = await prisma.product.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      images: {
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button asChild>
          <Link href="/sell">
            <Plus className="h-4 w-4 mr-2" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={product.images[0]?.url || "/placeholder.svg?height=300&width=500"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <Badge
                  className={`absolute top-2 right-2 ${
                    product.status === "AVAILABLE"
                      ? "bg-green-500"
                      : product.status === "SOLD"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                >
                  {product.status}
                </Badge>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                <CardDescription>{formatPrice(product.price)}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </CardContent>
              <CardFooter className="p-4 grid grid-cols-3 gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/products/${product.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/listings/${product.id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Link href={`/dashboard/listings/${product.id}/delete`}>
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold">No listings yet</h2>
          <p className="text-muted-foreground mt-2">
            You haven't created any listings yet. Start selling by adding your first item.
          </p>
          <Button asChild className="mt-4">
            <Link href="/sell">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Listing
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
