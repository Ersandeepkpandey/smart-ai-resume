export interface Author {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  role: 'admin' | 'author' | 'contributor'
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  postCount: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  postCount: number
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  authorId: string
  author?: Author
  categoryId: string
  category?: Category
  tags: Tag[]
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  readingTime: number
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  parentId?: string
  authorName: string
  authorEmail: string
  content: string
  status: 'pending' | 'approved' | 'spam'
  createdAt: string
  replies?: Comment[]
}

export interface PostFilters {
  category?: string
  tag?: string
  author?: string
  status?: Post['status']
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
