/**
 * Blog API Routes Tests
 * Tests for /api/blog/posts, /api/blog/categories, /api/blog/tags, /api/blog/comments
 */

describe('Blog Posts API', () => {
  const baseUrl = 'http://localhost:3000'

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET /api/blog/posts', () => {
    it('returns paginated posts list', async () => {
      const mockResponse = {
        data: [
          {
            id: 'post-1',
            title: 'Test Post',
            slug: 'test-post',
            excerpt: 'Test excerpt',
            status: 'published'
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await fetch(`${baseUrl}/api/blog/posts`)
      const data = await response.json()

      expect(data.data).toHaveLength(1)
      expect(data.totalPages).toBe(1)
    })

    it('filters posts by category', async () => {
      const mockResponse = {
        data: [{ id: 'post-1', categoryId: 'cat-1' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await fetch(`${baseUrl}/api/blog/posts?category=resume-tips`)
      const data = await response.json()

      expect(data.data[0].categoryId).toBe('cat-1')
    })

    it('filters posts by status', async () => {
      const mockResponse = {
        data: [{ id: 'post-1', status: 'draft' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await fetch(`${baseUrl}/api/blog/posts?status=draft`)
      const data = await response.json()

      expect(data.data[0].status).toBe('draft')
    })

    it('searches posts by title', async () => {
      const mockResponse = {
        data: [{ id: 'post-1', title: 'Resume Writing Tips' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await fetch(`${baseUrl}/api/blog/posts?search=resume`)
      const data = await response.json()

      expect(data.data[0].title).toContain('Resume')
    })

    it('handles pagination parameters', async () => {
      const mockResponse = {
        data: [],
        total: 50,
        page: 3,
        limit: 10,
        totalPages: 5
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await fetch(`${baseUrl}/api/blog/posts?page=3&limit=10`)
      const data = await response.json()

      expect(data.page).toBe(3)
      expect(data.totalPages).toBe(5)
    })
  })

  describe('GET /api/blog/posts/[slug]', () => {
    it('returns single post by slug', async () => {
      const mockPost = {
        id: 'post-1',
        title: 'Test Post',
        slug: 'test-post',
        content: 'Full content here...',
        author: { id: 'author-1', name: 'John Doe' },
        category: { id: 'cat-1', name: 'Resume Tips' }
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPost)
      })

      const response = await fetch(`${baseUrl}/api/blog/posts/test-post`)
      const data = await response.json()

      expect(data.slug).toBe('test-post')
      expect(data.author.name).toBe('John Doe')
    })

    it('returns 404 for non-existent post', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Post not found' })
      })

      const response = await fetch(`${baseUrl}/api/blog/posts/non-existent`)

      expect(response.ok).toBe(false)
      expect(response.status).toBe(404)
    })

    it('increments view count on fetch', async () => {
      const mockPost = {
        id: 'post-1',
        viewCount: 101
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPost)
      })

      const response = await fetch(`${baseUrl}/api/blog/posts/test-post`)
      const data = await response.json()

      expect(data.viewCount).toBeGreaterThan(100)
    })
  })

  describe('POST /api/blog/posts', () => {
    it('creates new post with valid data', async () => {
      const newPost = {
        title: 'New Post',
        content: 'Post content here...',
        categoryId: 'cat-1',
        status: 'draft'
      }

      const mockResponse = {
        id: 'post-new',
        ...newPost,
        slug: 'new-post',
        createdAt: new Date().toISOString()
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await fetch(`${baseUrl}/api/blog/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.slug).toBe('new-post')
    })

    it('rejects post with missing title', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Title is required' })
      })

      const response = await fetch(`${baseUrl}/api/blog/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'No title' })
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
    })

    it('generates slug from title automatically', async () => {
      const newPost = {
        title: 'My Amazing Blog Post Title',
        content: 'Content...'
      }

      const mockResponse = {
        ...newPost,
        slug: 'my-amazing-blog-post-title'
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await fetch(`${baseUrl}/api/blog/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })
      const data = await response.json()

      expect(data.slug).toBe('my-amazing-blog-post-title')
    })
  })

  describe('PUT /api/blog/posts/[slug]', () => {
    it('updates existing post', async () => {
      const updates = {
        title: 'Updated Title',
        content: 'Updated content'
      }

      const mockResponse = {
        id: 'post-1',
        ...updates,
        updatedAt: new Date().toISOString()
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await fetch(`${baseUrl}/api/blog/posts/test-post`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const data = await response.json()

      expect(data.title).toBe('Updated Title')
    })

    it('returns 404 for non-existent post update', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Post not found' })
      })

      const response = await fetch(`${baseUrl}/api/blog/posts/non-existent`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated' })
      })

      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /api/blog/posts/[slug]', () => {
    it('deletes existing post', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Post deleted successfully' })
      })

      const response = await fetch(`${baseUrl}/api/blog/posts/test-post`, {
        method: 'DELETE'
      })
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.message).toContain('deleted')
    })

    it('returns 404 for non-existent post deletion', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Post not found' })
      })

      const response = await fetch(`${baseUrl}/api/blog/posts/non-existent`, {
        method: 'DELETE'
      })

      expect(response.status).toBe(404)
    })
  })
})

describe('Blog Categories API', () => {
  const baseUrl = 'http://localhost:3000'

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET /api/blog/categories', () => {
    it('returns all categories', async () => {
      const mockCategories = [
        { id: 'cat-1', name: 'Resume Tips', slug: 'resume-tips', postCount: 15 },
        { id: 'cat-2', name: 'Career Advice', slug: 'career-advice', postCount: 12 }
      ]

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCategories)
      })

      const response = await fetch(`${baseUrl}/api/blog/categories`)
      const data = await response.json()

      expect(data).toHaveLength(2)
      expect(data[0].name).toBe('Resume Tips')
    })
  })

  describe('POST /api/blog/categories', () => {
    it('creates new category', async () => {
      const newCategory = {
        name: 'Job Search',
        description: 'Tips for finding jobs'
      }

      const mockResponse = {
        id: 'cat-new',
        ...newCategory,
        slug: 'job-search',
        postCount: 0
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await fetch(`${baseUrl}/api/blog/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })
      const data = await response.json()

      expect(data.slug).toBe('job-search')
    })

    it('rejects duplicate category slug', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ error: 'Category with this slug already exists' })
      })

      const response = await fetch(`${baseUrl}/api/blog/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Resume Tips' })
      })

      expect(response.status).toBe(409)
    })
  })
})

describe('Blog Tags API', () => {
  const baseUrl = 'http://localhost:3000'

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET /api/blog/tags', () => {
    it('returns all tags sorted by post count', async () => {
      const mockTags = [
        { id: 'tag-1', name: 'Interview', slug: 'interview', postCount: 10 },
        { id: 'tag-2', name: 'ATS', slug: 'ats', postCount: 5 }
      ]

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTags)
      })

      const response = await fetch(`${baseUrl}/api/blog/tags`)
      const data = await response.json()

      expect(data).toHaveLength(2)
      expect(data[0].postCount).toBeGreaterThanOrEqual(data[1].postCount)
    })
  })
})

describe('Blog Comments API', () => {
  const baseUrl = 'http://localhost:3000'

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET /api/blog/comments', () => {
    it('returns comments for post', async () => {
      const mockComments = [
        {
          id: 'comment-1',
          postId: 'post-1',
          authorName: 'John',
          content: 'Great post!',
          status: 'approved'
        }
      ]

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockComments)
      })

      const response = await fetch(`${baseUrl}/api/blog/comments?postId=post-1`)
      const data = await response.json()

      expect(data).toHaveLength(1)
      expect(data[0].status).toBe('approved')
    })
  })

  describe('POST /api/blog/comments', () => {
    it('creates new comment with pending status', async () => {
      const newComment = {
        postId: 'post-1',
        authorName: 'Test User',
        authorEmail: 'test@example.com',
        content: 'Nice article!'
      }

      const mockResponse = {
        id: 'comment-new',
        ...newComment,
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await fetch(`${baseUrl}/api/blog/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      })
      const data = await response.json()

      expect(data.status).toBe('pending')
    })

    it('validates email format', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid email address' })
      })

      const response = await fetch(`${baseUrl}/api/blog/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: 'post-1',
          authorName: 'Test',
          authorEmail: 'invalid-email',
          content: 'Comment'
        })
      })

      expect(response.status).toBe(400)
    })
  })
})
