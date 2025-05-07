import { Suspense } from "react"
import { prisma } from "@/lib/db"
import { ProductCard } from "@/components/product-card"
import { SearchFilters } from "@/components/search-filters"
import { SearchPagination } from "@/components/search-pagination"
import { SearchSkeleton } from "@/components/search-skeleton"
import { pipeline } from "@huggingface/inference";
import { cosineSimilarity } from "@/lib/utils";

// Initialize Hugging Face pipeline for embeddings
const embeddingPipeline = pipeline("feature-extraction", {
  model: "sentence-transformers/all-MiniLM-L6-v2",
});

interface SearchPageProps {
  searchParams: {
    query?: string
    category?: string
    sort?: string
    page?: string
    limit?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        {searchParams.query
          ? `Search results for "${searchParams.query}"`
          : searchParams.category
            ? `Browse ${searchParams.category}`
            : "Browse all items"}
      </h1>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <SearchFilters />
        <div>
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function SearchResults({ searchParams }: { searchParams: SearchPageProps['searchParams'] }) {
  const { query = "", category = "", sort = "newest", page = "1", limit = "20" } = searchParams;

  const parsedPage = Number.parseInt(page);
  const parsedLimit = Number.parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  // Generate query embedding
  let queryEmbedding = [];
  try {
    queryEmbedding = await embeddingPipeline(query);
  } catch (error) {
    console.error("Error generating query embedding:", error);
  }

  // Fetch all products and calculate similarity
  const allProducts = await prisma.product.findMany({
    where: { status: "AVAILABLE" },
    include: {
      images: { take: 1 },
      user: true,
    },
  });

  const productsWithSimilarity = allProducts.map((product) => {
    const productEmbedding = product.embedding || [];
    const similarity = cosineSimilarity(queryEmbedding, productEmbedding);
    return { ...product, similarity };
  });

  // Filter and sort products by similarity
  const filteredProducts = productsWithSimilarity
    .filter((product) => product.similarity > 0.5) // Adjust threshold as needed
    .sort((a, b) => b.similarity - a.similarity)
    .slice(skip, skip + parsedLimit);

  // Get total count
  const total = filteredProducts.length;

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">No items found</h2>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {skip + 1}-{Math.min(skip + parsedLimit, total)} of {total} results
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <SearchPagination total={total} limit={parsedLimit} />
    </div>
  );
}
