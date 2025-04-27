import { SearchSkeleton } from "@/components/search-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-10">
      <Skeleton className="h-10 w-40 mb-6" />
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-24 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-8 w-24 mb-2" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <SearchSkeleton />
      </div>
    </div>
  )
}
