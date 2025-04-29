"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { debounce } from "lodash"

export default function SearchBox() {
     const [query, setQuery] = useState("")
     const [suggestions, setSuggestions] = useState([])
     const [isLoading, setIsLoading] = useState(false)
     const router = useRouter()

     const fetchSuggestions = debounce(async (searchTerm: string) => {
          if (!searchTerm) {
               setSuggestions([])
               return
          }

          setIsLoading(true)
          try {
               const response = await fetch(`/api/search-suggestions?query=${searchTerm}`)
               const data = await response.json()
               setSuggestions(data.suggestions || [])
          } catch (error) {
               console.error("Error fetching suggestions:", error)
          } finally {
               setIsLoading(false)
          }
     }, 300)

     useEffect(() => {
          fetchSuggestions(query)
     }, [query])

     const handleSearch = (e: React.FormEvent) => {
          e.preventDefault()
          if (query.trim()) {
               router.push(`/search?query=${query}`)
          }
     }

     return (
          <div className="relative w-full max-w-lg">
               <form onSubmit={handleSearch} className="flex items-center">
                    <Input
                         type="text"
                         placeholder="Search for anything..."
                         value={query}
                         onChange={(e) => setQuery(e.target.value)}
                         className="w-full py-2 px-4 rounded-l-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300"
                    />
                    <button
                         type="submit"
                         className="bg-secondary text-white px-4 py-2 rounded-r-md hover:bg-secondary/90 transition-all duration-300"
                    >
                         Search
                    </button>
               </form>
               {isLoading && <p className="absolute top-full mt-1 text-sm text-gray-500">Loading...</p>}
               {suggestions.length > 0 && (
                    <ul className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 animate-fade-in">
                         {suggestions.map((suggestion: { id: string; name: string }) => (
                              <li
                                   key={suggestion.id}
                                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                                   onClick={() => router.push(`/products/${suggestion.id}`)}
                              >
                                   {suggestion.name}
                              </li>
                         ))}
                    </ul>
               )}
          </div>
     )
}