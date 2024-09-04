'use client'

import { useState, useEffect, useCallback, SetStateAction, ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Newspaper, RefreshCcw, Loader2 } from "lucide-react"

const fetchNews = async (page = 1, searchTerm = '', category = '') => {
  const response = await fetch(`/api/news?page=${page}&q=${encodeURIComponent(searchTerm)}&category=${category}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch news')
  }

  return data
}

const categories = [
  { value: 'world', label: 'World' },
  { value: 'politics', label: 'Politics' },
  { value: 'business', label: 'Business' },
  { value: 'technology', label: 'Technology' },
  { value: 'science', label: 'Science' },
  { value: 'sport', label: 'Sport' },
  { value: 'media', label: 'Media' },
  {value:'culture', label: 'Culture'},
  {value:'lifeandstyle', label: 'Lifeandstyle'},
  {value:'education', label: 'Education'},
  {value:'music', label: 'Music'},
]

export default function Home() {
  const [news, setNews] = useState<{
    title: ReactNode
    date: ReactNode
    category: ReactNode
    image: any
    description: ReactNode
    url(url: any, arg1: string): string, id: string 
}[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')

  const loadNews = useCallback(async () => {
    setLoading(true)
    try {
      const { articles, currentPage, totalPages } = await fetchNews(page, searchTerm, category)
      setNews(articles)
      setPage(currentPage)
      setTotalPages(totalPages)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }, [page, searchTerm, category])

  useEffect(() => {
    loadNews()
  }, [loadNews])

  const handleSearch = (e: { target: { value: SetStateAction<string> } }) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }

  const handleCategoryChange = (value: SetStateAction<string>) => {
    setCategory(value)
    setPage(1)
  }

  const handleRefresh = () => {
    setPage(1)
    loadNews()
  }

  const handlePageChange = (newPage: SetStateAction<number>) => {
    setPage(newPage)
  }

  return (
    <div className="min-h-screen bg-black-100 p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">WorldWire</h1>
        <p className="text-white-600">Stay updated with the latest news from The Guardian</p>
        <p className="text-white-400">Please choose a news section below</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </header>

      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex gap-4 mb-4">
          <Input 
            type="search" 
            placeholder="Search news..." 
            className="flex-grow text-black" 
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category"/>
              <Newspaper className="ml-2 h-4 w-4" />
            </SelectTrigger>
            <SelectContent className='bg-black'>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={loading}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center mt-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p>Loading news...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription>{article.date} - {article.category}</CardDescription>
                  </CardHeader>
                  {article.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={article.image} alt={article.title?.toString() ?? ''} className="w-full h-48 object-cover" />
                  )}
                  <CardContent>
                    <p className="text-sm">{article.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={() => window.open(article.url as unknown as string, '_blank')}>
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8 gap-2">
              <Button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <span className="self-center">
                Page {page} of {totalPages}
              </span>
              <Button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </>
        )}

        {news.length === 0 && !loading && (
          <p className="text-center mt-4 text-gray-500">No news found. Try a different search term or category.</p>
        )}
      </div>

      <footer className="text-center text-gray-500">
        <p>&copy; 2023 WorldWire. All rights reserved.</p>
      </footer>
    </div>
  )
}