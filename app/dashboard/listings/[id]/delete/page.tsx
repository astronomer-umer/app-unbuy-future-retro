"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"

export default function DeleteListingPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status: sessionStatus } = useSession()

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/listings")
      return
    }

    if (sessionStatus === "authenticated") {
      // Fetch product data
      fetch(`/api/products/${params.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Product not found")
          return res.json()
        })
        .then((data) => {
          const product = data.product

          // Check if the product belongs to the current user
          if (product.userId !== session?.user?.id) {
            toast({
              title: "Unauthorized",
              description: "You don't have permission to delete this listing",
              variant: "destructive",
            })
            router.push("/dashboard/listings")
            return
          }

          setProduct(product)
          setIsFetching(false)
        })
        .catch((error) => {
          console.error("Error fetching product:", error)
          toast({
            title: "Error",
            description: "Failed to load product details",
            variant: "destructive",
          })
          router.push("/dashboard/listings")
        })
    }
  }, [params.id, router, sessionStatus, session, toast])

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to delete listing")
      }

      toast({
        title: "Listing deleted",
        description: "Your item has been deleted successfully.",
      })

      router.push("/dashboard/listings")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Delete Listing</CardTitle>
            <CardDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {product && (
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-md overflow-hidden">
                  <Image
                    src={product.images[0]?.url || "/placeholder.svg?height=96&width=96"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-muted-foreground">{formatPrice(product.price)}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Listing"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
