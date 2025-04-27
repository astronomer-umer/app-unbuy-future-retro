"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface FavoriteButtonProps {
  productId: string
  isFavorited: boolean
}

export function FavoriteButton({ productId, isFavorited: initialIsFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const toggleFavorite = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/favorites", {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update favorite")
      }

      setIsFavorited(!isFavorited)
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited
          ? "This item has been removed from your favorites."
          : "This item has been added to your favorites.",
      })

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

  return (
    <Button
      variant={isFavorited ? "secondary" : "outline"}
      size="icon"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={isFavorited ? "text-secondary-foreground" : "text-secondary"}
    >
      <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
      <span className="sr-only">{isFavorited ? "Remove from favorites" : "Add to favorites"}</span>
    </Button>
  )
}
