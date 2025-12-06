'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, Eye, Calendar, Share2, Bookmark, Loader2 } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { CommentSection, AuthorBio, PostCard } from '@/components/blog'
import { Post, Comment } from '@/lib/blog/types'
import { formatDate, getRelativeTime } from '@/lib/blog/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function BlogPostPage({ params }: PageProps) {
  const { slug } = use(params)
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/blog/posts/${slug}`)

        if (!res.ok) {
          if (res.status === 404) {
            setError('Post not found')
            return
          }
          throw new Error('Failed to fetch post')
        }

        const data = await res.json()
        setPost(data.post)

        const [commentsRes, relatedRes] = await Promise.all([
          fetch(`/api/blog/comments?postId=${data.post.id}`),
          fetch(`/api/blog/posts?category=${data.post.category?.slug}&limit=3`)
        ])

        if (commentsRes.ok) {
          const commentsData = await commentsRes.json()
          setComments(commentsData.comments || [])
        }

        if (relatedRes.ok) {
          const relatedData = await relatedRes.json()
          setRelatedPosts(
            (relatedData.data || []).filter((p: Post) => p.id !== data.post.id).slice(0, 3)
          )
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href
        })
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Post not found'}
          </h1>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Blog
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                {post.category.name}
              </Link>
            )}
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.avatar ? (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {post.author.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{post.author.name}</span>
                </div>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {post.readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye size={16} />
                {post.viewCount} views
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 size={20} />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Bookmark"
              >
                <Bookmark size={20} />
              </button>
            </div>
          </div>
        </header>

        {post.featuredImage && (
          <div className="aspect-[16/9] relative rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.author && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About the Author</h2>
            <AuthorBio author={post.author} />
          </div>
        )}

        <CommentSection
          postId={post.id}
          comments={comments}
          onCommentSubmit={(comment) => setComments([comment, ...comments])}
        />

        {relatedPosts.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </article>

      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Rezume. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
