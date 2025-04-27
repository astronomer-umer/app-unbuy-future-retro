import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Heart, MessageSquare, Settings, Plus } from "lucide-react"
import { DashboardStats } from "@/components/dashboard-stats"
import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={session.user.id} />
      </Suspense>
    </div>
  )
}

async function DashboardContent({ userId }: { userId: string }) {
  // Get user's products
  const products = await prisma.product.findMany({
    where: {
      userId,
    },
    include: {
      images: {
        take: 1,
      },
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  })

  // Get user's favorites
  const favorites = await prisma.favorite.count({
    where: {
      userId,
    },
  })

  // Get user's messages
  const messages = await prisma.message.count({
    where: {
      receiverId: userId,
      read: false,
    },
  })

  return (
    <>
      <div className="grid gap-6 md:grid-cols-4">
        <DashboardStats
          title="Active Listings"
          value={products.length.toString()}
          icon={<Package className="h-5 w-5" />}
          href="/dashboard/listings"
        />
        <DashboardStats
          title="Favorites"
          value={favorites.toString()}
          icon={<Heart className="h-5 w-5" />}
          href="/dashboard/favorites"
        />
        <DashboardStats
          title="Unread Messages"
          value={messages.toString()}
          icon={<MessageSquare className="h-5 w-5" />}
          href="/dashboard/messages"
        />
        <DashboardStats
          title="Account Settings"
          value="Manage"
          icon={<Settings className="h-5 w-5" />}
          href="/dashboard/settings"
        />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Listings</h2>
          <Button asChild>
            <Link href="/sell">
              <Plus className="h-4 w-4 mr-2" />
              Add New Listing
            </Link>
          </Button>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                  <CardDescription>{formatPrice(product.price)}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </CardContent>
                <CardFooter className="p-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/dashboard/listings/${product.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No listings yet</CardTitle>
              <CardDescription>
                You haven't created any listings yet. Start selling by adding your first item.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/sell">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {products.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/dashboard/listings">View All Listings</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
