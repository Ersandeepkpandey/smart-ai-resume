'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Tag,
  AlertCircle,
  Check,
  X,
  Save,
  Search
} from 'lucide-react'
import { generateSlug } from '@/lib/blog/utils'
import type { Tag as TagType } from '@/lib/blog/types'

interface TagFormData {
  name: string
  slug: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagType[]>([])
  const [filteredTags, setFilteredTags] = useState<TagType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<TagType | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    slug: ''
  })

  const [editFormData, setEditFormData] = useState<TagFormData>({
    name: '',
    slug: ''
  })

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch('/api/blog/tags')
      if (!response.ok) {
        throw new Error('Failed to fetch tags')
      }
      const data = await response.json()
      setTags(data)
      setFilteredTags(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  useEffect(() => {
    if (searchQuery) {
      const filtered = tags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTags(filtered)
    } else {
      setFilteredTags(tags)
    }
  }, [searchQuery, tags])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false
  ) => {
    const { name, value } = e.target
    const setter = isEdit ? setEditFormData : setFormData

    if (name === 'name') {
      setter((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value)
      }))
    } else {
      setter((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/blog/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create tag')
      }

      setSuccess('Tag created successfully')
      setFormData({ name: '', slug: '' })
      setShowNewForm(false)
      await fetchTags()

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleStartEdit = (tag: TagType) => {
    setEditingId(tag.id)
    setEditFormData({
      name: tag.name,
      slug: tag.slug
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditFormData({ name: '', slug: '' })
  }

  const handleUpdate = async (tagId: string) => {
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/blog/tags/${tagId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update tag')
      }

      setSuccess('Tag updated successfully')
      setEditingId(null)
      await fetchTags()

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = (tag: TagType) => {
    setTagToDelete(tag)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!tagToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/blog/tags/${tagToDelete.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete tag')
      }

      setSuccess('Tag deleted successfully')
      await fetchTags()
      setDeleteModalOpen(false)
      setTagToDelete(null)

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tag')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/admin/blog"
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Tags</h1>
              <p className="text-gray-600">
                Manage your blog tags ({tags.length} total)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showNewForm ? (
              <>
                <X size={20} className="mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus size={20} className="mr-2" />
                New Tag
              </>
            )}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle size={20} className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={18} className="text-red-500" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <Check size={20} className="text-green-500 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* New Tag Form */}
        {showNewForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Tag
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="Tag name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="tag-slug"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save size={18} className="mr-2" />
                  {isSaving ? 'Creating...' : 'Create Tag'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tags Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Tag size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {searchQuery ? 'No tags found' : 'No tags yet'}
              </p>
              <p className="text-sm">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Create your first tag to organize your posts'}
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className={`group relative ${
                      editingId === tag.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } border rounded-lg p-3 transition-colors`}
                  >
                    {editingId === tag.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={(e) => handleInputChange(e, true)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdate(tag.id)}
                          disabled={isSaving}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {tag.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tag.postCount} posts
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(tag)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(tag)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && tagToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Tag
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{tagToDelete.name}"?
                {tagToDelete.postCount > 0 && (
                  <span className="block mt-2 text-orange-600">
                    This tag is used in {tagToDelete.postCount} post(s). The tag
                    will be removed from these posts.
                  </span>
                )}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false)
                    setTagToDelete(null)
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
