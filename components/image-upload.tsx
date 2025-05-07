"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  maxFiles?: number
}

export function ImageUpload({ value, onChange, maxFiles = 5 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || !files.length) return

    if (value.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} images`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real app, you would upload to a storage service
      // For this example, we'll simulate uploads with placeholders
      const newImages: string[] = []

      for (let i = 0; i < files.length; i++) {
        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Use placeholder image
        newImages.push(`/placeholder.svg?height=400&width=400&text=Image${value.length + i + 1}`)
      }

      onChange([...value, ...newImages])
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (index: number) => {
    const newImages = [...value]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  const safeValue = value || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {safeValue.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
            <Image src={url || "/placeholder.svg"} alt={`Uploaded image ${index + 1}`} fill className="object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {safeValue.length < maxFiles && (
          <div className="relative aspect-square rounded-md border border-dashed flex flex-col items-center justify-center">
            <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{isUploading ? "Uploading..." : "Upload Image"}</p>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={isUploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
