'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Eye, MessageCircle, Calendar } from 'lucide-react'
import { Post } from '@/lib/blog/types'
import { formatDate, getRelativeTime } from '@/lib/blog/utils'

interface PostCardProps {
  post: Post
  variant?: 'default' | 'featured' | 'compact'
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
        <Link href={`/blog/${post.slug}`}>
          <div className="aspect-[16/9] relative">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              {post.category && (
                <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs font-medium mb-3">
                  {post.category.name}
                </span>
              )}
              <h2 className="text-2xl font-bold mb-2 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-gray-200 text-sm line-clamp-2 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {post.readingTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {post.viewCount}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className="flex gap-4 py-4 border-b last:border-b-0">
        <Link href={`/blog/${post.slug}`} className="shrink-0">
          <div className="w-20 h-20 relative rounded-lg overflow-hidden">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors">
              {post.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{getRelativeTime(post.publishedAt || post.createdAt)}</span>
            <span>·</span>
            <span>{post.readingTime} min</span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <Link href={`/blog/${post.slug}`}>
        <div className="aspect-[16/10] relative overflow-hidden">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {post.category && (
            <Link
              href={`/blog/category/${post.category.slug}`}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              {post.category.name}
            </Link>
          )}
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-500">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mb-2 transition-colors">
            {post.title}
          </h2>
        </Link>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {post.author?.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                {post.author?.name?.charAt(0) || 'A'}
              </div>
            )}
            <span>{post.author?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readingTime}m
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {post.viewCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
