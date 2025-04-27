import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formatPrice, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageForm } from "@/components/message-form"
import { FavoriteButton } from "@/components/favorite-button"
import { MapPin, Calendar } from "lucide-react"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const session = await getSession()

  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
    include: {
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  const isOwner = session?.user?.id === product.userId

  // Check if the current user has favorited this product
  let isFavorited = false

  if (session?.user) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id,
        },
      },
    })

    isFavorited = !!favorite
  }

  // Get similar products
  const similarProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: {
        not: product.id,
      },
      status: "AVAILABLE",
    },
    include: {
      images: {
        take: 1,
      },
    },
    take: 4,
  })

  return (
    <div className="container py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          {product.images.length > 0 ? (
            <>
              <div className="aspect-square overflow-hidden rounded-lg border">
                <Image
                  src={product.images[0].url || "/placeholder.svg"}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(1).map((image) => (
                    <div key={image.id} className="aspect-square overflow-hidden rounded-lg border">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={product.title}
                        width={150}
                        height={150}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square overflow-hidden rounded-lg border">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt={product.title}
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-3xl font-bold mt-2 text-primary">{formatPrice(product.price)}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              {product.condition}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {product.category}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{product.location || "Location not specified"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Listed on {formatDate(product.createdAt)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-4">
            <Link href={`/profile/${product.user.id}`} className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={product.user.image || ""} alt={product.user.name || "User"} />
                <AvatarFallback>{product.user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{product.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(product.user.createdAt).getFullYear()}
                </p>
              </div>
            </Link>
          </div>

          {!isOwner && (
            <div className="flex gap-4">
              {session?.user ? (
                <>
                  <Button className="flex-1" asChild>
                    <Link href={`/messages/${product.user.id}`}>Contact Seller</Link>
                  </Button>
                  <FavoriteButton productId={product.id} isFavorited={isFavorited} />
                </>
              ) : (
                <Button className="flex-1" asChild>
                  <Link href={`/login?callbackUrl=/products/${product.id}`}>Login to Contact Seller</Link>
                </Button>
              )}
            </div>
          )}

          {isOwner && (
            <div className="flex gap-4">
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/dashboard/listings/${product.id}/edit`}>Edit Listing</Link>
              </Button>
              <Button asChild variant="destructive" className="flex-1">
                <Link href={`/dashboard/listings/${product.id}/delete`}>Delete Listing</Link>
              </Button>
            </div>
          )}

          {!isOwner && session?.user && (
            <div className="mt-6">
              <MessageForm sellerId={product.userId} productId={product.id} />
            </div>
          )}
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map((similarProduct) => (
              <Link key={similarProduct.id} href={`/products/${similarProduct.id}`} className="group">
                <div className="aspect-square overflow-hidden rounded-lg border hover:border-primary/30 hover:shadow-md">
                  <Image
                    src={similarProduct.images[0]?.url || "/placeholder.svg?height=300&width=300"}
                    alt={similarProduct.title}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold line-clamp-1">{similarProduct.title}</h3>
                  <p className="font-bold text-primary">{formatPrice(similarProduct.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
