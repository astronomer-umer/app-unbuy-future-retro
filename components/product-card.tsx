import Link from "next/link"
import Image from "next/image"
import { formatPrice, formatDate } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  product: any
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden">
        {product.images && product.images[0] ? (
          <Image
            src={product.images[0].url || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        ) : (
          <Image src="/placeholder.svg?height=400&width=400" alt={product.title} fill className="object-cover" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
        >
          <Heart className="h-4 w-4 text-secondary" />
          <span className="sr-only">Add to favorites</span>
        </Button>
      </Link>
      <CardContent className="p-4">
        <div className="space-y-1">
          <h3 className="font-semibold line-clamp-1">{product.title}</h3>
          <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
          <p className="text-xs text-muted-foreground">{product.location || "Location not specified"}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={product.user.image || ""} alt={product.user.name || "User"} />
            <AvatarFallback>{product.user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{product.user.name}</span>
        </div>
        <span className="text-xs text-muted-foreground">{formatDate(product.createdAt)}</span>
      </CardFooter>
    </Card>
  )
}

export { ProductCard }
export default ProductCard
