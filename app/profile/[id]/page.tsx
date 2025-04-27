import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { MessageSquare, Star } from "lucide-react"
import Link from "next/link"

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getSession()

  // Get user profile
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
    },
  })

  if (!user) {
    notFound()
  }

  // Get user's active listings
  const products = await prisma.product.findMany({
    where: {
      userId: user.id,
      status: "AVAILABLE",
    },
    include: {
      images: {
        take: 1,
      },
      user: true,
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  })

  // Check if current user is viewing their own profile
  const isOwnProfile = session?.user?.id === user.id

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-1/3">
          <div className="rounded-lg border bg-card p-6 sticky top-20">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>

              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <Star className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm text-muted-foreground">(4.0)</span>
              </div>

              {!isOwnProfile && (
                <Button className="mt-4 w-full" asChild>
                  <Link href={`/messages/${user.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact
                  </Link>
                </Button>
              )}

              {isOwnProfile && (
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link href="/dashboard/settings">Edit Profile</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-6">Active Listings</h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg">
              <p className="text-muted-foreground">No active listings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
