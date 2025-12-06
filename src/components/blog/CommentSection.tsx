'use client'

import { useState } from 'react'
import { MessageCircle, Send, User } from 'lucide-react'
import { Comment } from '@/lib/blog/types'
import { getRelativeTime, validateEmail } from '@/lib/blog/utils'

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  onCommentSubmit?: (comment: Comment) => void
}

interface CommentFormData {
  authorName: string
  authorEmail: string
  content: string
}

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-100' : ''}`}>
      <div className="py-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium shrink-0">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900">{comment.authorName}</span>
              <span className="text-gray-400 text-sm">·</span>
              <span className="text-gray-500 text-sm">
                {getRelativeTime(comment.createdAt)}
              </span>
            </div>
            <p className="text-gray-700 mt-1 whitespace-pre-wrap">{comment.content}</p>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-blue-600 hover:text-blue-700 text-sm mt-2 flex items-center gap-1"
            >
              <MessageCircle size={14} />
              Reply
            </button>
          </div>
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  )
}

export default function CommentSection({ postId, comments, onCommentSubmit }: CommentSectionProps) {
  const [formData, setFormData] = useState<CommentFormData>({
    authorName: '',
    authorEmail: '',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!formData.authorName.trim()) {
      setError('Please enter your name')
      return
    }

    if (!validateEmail(formData.authorEmail)) {
      setError('Please enter a valid email address')
      return
    }

    if (formData.content.trim().length < 3) {
      setError('Comment is too short')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          ...formData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit comment')
      }

      setSuccess(true)
      setFormData({ authorName: '', authorEmail: '', content: '' })
      onCommentSubmit?.(data.comment)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageCircle className="text-blue-600" />
        Comments ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Leave a Comment</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="authorName"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="authorEmail"
              value={formData.authorEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Comment *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            placeholder="Write your comment..."
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            Your comment has been submitted and is awaiting moderation.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={16} />
              Post Comment
            </>
          )}
        </button>
      </form>

      {comments.length > 0 ? (
        <div className="divide-y">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </section>
  )
}
