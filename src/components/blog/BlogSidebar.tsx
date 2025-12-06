'use client'

import Link from 'next/link'
import { Search, Folder, Tag, TrendingUp } from 'lucide-react'
import { Category, Tag as TagType, Post } from '@/lib/blog/types'
import PostCard from './PostCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BlogSidebarProps {
  categories?: Category[]
  tags?: TagType[]
  popularPosts?: Post[]
}

export default function BlogSidebar({ categories = [], tags = [], popularPosts = [] }: BlogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <aside className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search size={18} />
          Search
        </h3>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
            >
              <Search size={18} />
            </button>
          </div>
        </form>
      </div>

      {categories.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Folder size={18} />
            Categories
          </h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700 hover:text-blue-600">{category.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {category.postCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tags.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Tag size={18} />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {popularPosts.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} />
            Popular Posts
          </h3>
          <div className="space-y-1">
            {popularPosts.map((post) => (
              <PostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="font-bold text-xl mb-2">Subscribe to Newsletter</h3>
        <p className="text-blue-100 text-sm mb-4">
          Get the latest articles delivered straight to your inbox.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-blue-200 text-white border border-white/30 focus:bg-white/30 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </aside>
  )
}
