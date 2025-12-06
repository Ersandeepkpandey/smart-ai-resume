'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { BookOpen, Loader2 } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { PostCard, BlogSidebar, Pagination } from '@/components/blog'
import { Post, Category, Tag, PaginatedResult } from '@/lib/blog/types'

function BlogContent() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const page = parseInt(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.set('page', page.toString())
        params.set('limit', '9')
        if (search) params.set('search', search)
        if (category) params.set('category', category)

        const [postsRes, categoriesRes, tagsRes] = await Promise.all([
          fetch(`/api/blog/posts?${params}`),
          fetch('/api/blog/categories'),
          fetch('/api/blog/tags')
        ])

        if (!postsRes.ok) throw new Error('Failed to fetch posts')

        const postsData: PaginatedResult<Post> = await postsRes.json()
        const categoriesData = await categoriesRes.json()
        const tagsData = await tagsRes.json()

        setPosts(postsData.data)
        setPagination({
          total: postsData.total,
          page: postsData.page,
          totalPages: postsData.totalPages
        })
        setCategories(categoriesData.categories || [])
        setTags(tagsData.tags || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, search, category])

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={32} />
            <h1 className="text-4xl font-bold">Blog</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl">
            Resume tips, career advice, and job search strategies to help you land your dream job.
          </p>
          {search && (
            <p className="mt-4 text-blue-200">
              Search results for: <span className="font-semibold text-white">{search}</span>
            </p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-6 rounded-xl">
                <p>{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h2>
                <p className="text-gray-600">
                  {search
                    ? `No articles match "${search}". Try a different search term.`
                    : 'Check back soon for new articles!'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  baseUrl="/blog"
                />
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <BlogSidebar
              categories={categories}
              tags={tags}
              popularPosts={posts.slice(0, 3)}
            />
          </div>
        </div>
      </main>
    </>
  )
}

function BlogLoading() {
  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={32} />
            <h1 className="text-4xl font-bold">Blog</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl">
            Resume tips, career advice, and job search strategies to help you land your dream job.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </main>
    </>
  )
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <Suspense fallback={<BlogLoading />}>
        <BlogContent />
      </Suspense>

      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Rezume. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
