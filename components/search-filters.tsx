"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = [
  { id: "electronics", name: "Electronics", subCategories: ["Phones", "Laptops", "Cameras"] },
  { id: "furniture", name: "Furniture", subCategories: ["Sofas", "Beds", "Tables"] },
  { id: "clothing", name: "Clothing", subCategories: ["Men", "Women", "Kids"] },
  { id: "vehicles", name: "Vehicles", subCategories: ["Cars", "Bikes", "Trucks"] },
  { id: "toys", name: "Toys & Games", subCategories: ["Action Figures", "Board Games", "Puzzles"] },
  { id: "sports", name: "Sports", subCategories: ["Fitness", "Outdoor", "Team Sports"] },
  { id: "books", name: "Books", subCategories: ["Fiction", "Non-Fiction", "Comics"] },
  { id: "jewelry", name: "Jewelry", subCategories: ["Necklaces", "Rings", "Bracelets"] },
  { id: "home", name: "Home & Garden", subCategories: ["Decor", "Tools", "Appliances"] },
  { id: "beauty", name: "Beauty", subCategories: ["Makeup", "Skincare", "Haircare"] },
  { id: "music", name: "Music", subCategories: ["Instruments", "Albums", "Accessories"] },
  { id: "art", name: "Art", subCategories: ["Paintings", "Sculptures", "Crafts"] },
]

const conditions = [
  { id: "new", name: "New" },
  { id: "like_new", name: "Like New" },
  { id: "good", name: "Good" },
  { id: "fair", name: "Fair" },
  { id: "poor", name: "Poor" },
]

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
]

interface SearchFiltersProps {
  currentCategory?: string
}

export function SearchFilters({ currentCategory }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get("sort") || "newest"
  const currentQuery = searchParams.get("query") || ""
  const currentCondition = searchParams.get("condition") || ""

  const createQueryString = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })

    return newParams.toString()
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (currentCategory) {
      router.push(
        `/search?${createQueryString({
          category: checked ? categoryId : null,
          page: "1",
        })}`,
      )
    } else {
      router.push(
        `/search?${createQueryString({
          category: checked ? categoryId : null,
          page: "1",
        })}`,
      )
    }
  }

  const handleSortChange = (value: string) => {
    const baseUrl = currentCategory ? `/categories/${currentCategory}` : "/search"
    router.push(
      `${baseUrl}?${createQueryString({
        sort: value,
        page: "1",
      })}`,
    )
  }

  const handleConditionChange = (conditionId: string, checked: boolean) => {
    const baseUrl = currentCategory ? `/categories/${currentCategory}` : "/search"
    router.push(
      `${baseUrl}?${createQueryString({
        condition: checked ? conditionId : null,
        page: "1",
      })}`,
    )
  }

  const handleReset = () => {
    if (currentCategory) {
      router.push(`/categories/${currentCategory}`)
    } else {
      router.push("/search")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>

      <div>
        <h3 className="font-medium mb-2">Sort By</h3>
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible defaultValue="categories">
        {!currentCategory && (
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex flex-col space-y-1">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={searchParams.get("category") === category.id}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                    {category.subCategories.map((sub) => (
                      <div key={sub} className="ml-4">
                        <Checkbox
                          id={`subcategory-${sub}`}
                          onCheckedChange={(checked) => handleCategoryChange(sub, checked as boolean)}
                        />
                        <Label htmlFor={`subcategory-${sub}`}>{sub}</Label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        <AccordionItem value="conditions">
          <AccordionTrigger>Condition</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <div key={condition.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition.id}`}
                    checked={currentCondition === condition.id}
                    onCheckedChange={(checked) => handleConditionChange(condition.id, checked as boolean)}
                  />
                  <Label htmlFor={`condition-${condition.id}`}>{condition.name}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
