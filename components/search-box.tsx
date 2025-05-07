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
               setSuggestions([]);
               return;
          }

          setIsLoading(true);
          try {
               const response = await fetch(`/api/search-suggestions?query=${searchTerm}`);
               if (!response.ok) {
                    throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
               }
               const data = await response.json();
               setSuggestions(data.suggestions || []);
          } catch (error) {
               console.error("Error fetching suggestions:", error);
               setSuggestions([]); // Clear suggestions on error
          } finally {
               setIsLoading(false);
          }
     }, 300);

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
                         className="w-full py-2 px-4 rounded-l-md rounded-r-none text-blue-800 font-medium text-lg  shadow-inner focus:outline-none focus:ring-4 focus:ring-lime-500 focus:ring-opacity-50 hover:drop-shadow-md hover:shadow-lime-300 transition-all duration-300"
                    />
                    <button
                         type="submit"
                         className="px-4 py-2 rounded-r-md 
                         bg-lime-300 hover:bg-blue-200 text-lime-950 shadow-inner shadow-blue-300  hover:shadow-lime-500 transition-all  hover:text-blue-950  font-medium duration-500"
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