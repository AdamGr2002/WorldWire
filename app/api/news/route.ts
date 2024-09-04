import { NextResponse } from 'next/server'

const API_KEY = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY
const API_URL = 'https://content.guardianapis.com/search'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const searchTerm = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const pageSize = '9'

  const guardianApiUrl = new URL(API_URL)
  guardianApiUrl.searchParams.append('api-key', API_KEY || '')
  guardianApiUrl.searchParams.append('page', page)
  guardianApiUrl.searchParams.append('page-size', pageSize)
  guardianApiUrl.searchParams.append('show-fields', 'headline,thumbnail,trailText')
  
  if (searchTerm) {
    guardianApiUrl.searchParams.append('q', searchTerm)
  }

  if (category) {
    guardianApiUrl.searchParams.append('section', category)
  }

  try {
    const response = await fetch(guardianApiUrl.toString())
    const data = await response.json()

    const articles = data.response.results.map((article: any) => ({
      id: article.id,
      title: article.fields.headline,
      description: article.fields.trailText,
      date: new Date(article.webPublicationDate).toLocaleDateString(),
      image: article.fields.thumbnail,
      url: article.webUrl,
      category: article.sectionName
    }))

    return NextResponse.json({
      articles,
      currentPage: data.response.currentPage,
      totalPages: data.response.pages
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }
}