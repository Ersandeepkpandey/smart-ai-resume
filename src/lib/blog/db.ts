import client from '@/lib/turso'
import { Post, Category, Tag, Comment, Author, PostFilters, PaginatedResult } from './types'
import { generateSlug, calculateReadingTime, extractExcerpt, generateId } from './utils'

export async function initBlogTables(): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS blog_authors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar TEXT,
      bio TEXT,
      role TEXT DEFAULT 'author',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS blog_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS blog_tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      featured_image TEXT,
      author_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      status TEXT DEFAULT 'draft',
      published_at TEXT,
      reading_time INTEGER DEFAULT 1,
      view_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (author_id) REFERENCES blog_authors(id),
      FOREIGN KEY (category_id) REFERENCES blog_categories(id)
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS blog_post_tags (
      post_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (post_id, tag_id),
      FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS blog_comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      parent_id TEXT,
      author_name TEXT NOT NULL,
      author_email TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
    )
  `)
}

export async function getPosts(filters: PostFilters = {}): Promise<PaginatedResult<Post>> {
  const page = filters.page || 1
  const limit = filters.limit || 10
  const offset = (page - 1) * limit

  let whereClause = 'WHERE 1=1'
  const args: (string | number)[] = []

  if (filters.status) {
    whereClause += ' AND p.status = ?'
    args.push(filters.status)
  } else {
    whereClause += ' AND p.status = ?'
    args.push('published')
  }

  if (filters.category) {
    whereClause += ' AND c.slug = ?'
    args.push(filters.category)
  }

  if (filters.author) {
    whereClause += ' AND a.id = ?'
    args.push(filters.author)
  }

  if (filters.search) {
    whereClause += ' AND (p.title LIKE ? OR p.content LIKE ?)'
    args.push(`%${filters.search}%`, `%${filters.search}%`)
  }

  const countResult = await client.execute({
    sql: `
      SELECT COUNT(*) as total
      FROM blog_posts p
      JOIN blog_categories c ON p.category_id = c.id
      JOIN blog_authors a ON p.author_id = a.id
      ${whereClause}
    `,
    args
  })

  const total = Number(countResult.rows[0]?.total || 0)

  const postsResult = await client.execute({
    sql: `
      SELECT
        p.*,
        c.id as cat_id, c.name as cat_name, c.slug as cat_slug,
        a.id as author_id, a.name as author_name, a.email as author_email, a.avatar as author_avatar
      FROM blog_posts p
      JOIN blog_categories c ON p.category_id = c.id
      JOIN blog_authors a ON p.author_id = a.id
      ${whereClause}
      ORDER BY p.published_at DESC, p.created_at DESC
      LIMIT ? OFFSET ?
    `,
    args: [...args, limit, offset]
  })

  const posts: Post[] = await Promise.all(
    postsResult.rows.map(async (row) => {
      const tagsResult = await client.execute({
        sql: `
          SELECT t.* FROM blog_tags t
          JOIN blog_post_tags pt ON t.id = pt.tag_id
          WHERE pt.post_id = ?
        `,
        args: [row.id as string]
      })

      return {
        id: row.id as string,
        title: row.title as string,
        slug: row.slug as string,
        excerpt: row.excerpt as string,
        content: row.content as string,
        featuredImage: row.featured_image as string | undefined,
        authorId: row.author_id as string,
        author: {
          id: row.author_id as string,
          name: row.author_name as string,
          email: row.author_email as string,
          avatar: row.author_avatar as string | undefined,
          role: 'author' as const,
          createdAt: ''
        },
        categoryId: row.category_id as string,
        category: {
          id: row.cat_id as string,
          name: row.cat_name as string,
          slug: row.cat_slug as string,
          postCount: 0
        },
        tags: tagsResult.rows.map(t => ({
          id: t.id as string,
          name: t.name as string,
          slug: t.slug as string,
          postCount: 0
        })),
        status: row.status as Post['status'],
        publishedAt: row.published_at as string | undefined,
        readingTime: Number(row.reading_time),
        viewCount: Number(row.view_count),
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string
      }
    })
  )

  return {
    data: posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const result = await client.execute({
    sql: `
      SELECT
        p.*,
        c.id as cat_id, c.name as cat_name, c.slug as cat_slug,
        a.id as auth_id, a.name as author_name, a.email as author_email, a.avatar as author_avatar, a.bio as author_bio
      FROM blog_posts p
      JOIN blog_categories c ON p.category_id = c.id
      JOIN blog_authors a ON p.author_id = a.id
      WHERE p.slug = ?
    `,
    args: [slug]
  })

  if (result.rows.length === 0) return null

  const row = result.rows[0]

  const tagsResult = await client.execute({
    sql: `
      SELECT t.* FROM blog_tags t
      JOIN blog_post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `,
    args: [row.id as string]
  })

  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    featuredImage: row.featured_image as string | undefined,
    authorId: row.author_id as string,
    author: {
      id: row.auth_id as string,
      name: row.author_name as string,
      email: row.author_email as string,
      avatar: row.author_avatar as string | undefined,
      bio: row.author_bio as string | undefined,
      role: 'author' as const,
      createdAt: ''
    },
    categoryId: row.category_id as string,
    category: {
      id: row.cat_id as string,
      name: row.cat_name as string,
      slug: row.cat_slug as string,
      postCount: 0
    },
    tags: tagsResult.rows.map(t => ({
      id: t.id as string,
      name: t.name as string,
      slug: t.slug as string,
      postCount: 0
    })),
    status: row.status as Post['status'],
    publishedAt: row.published_at as string | undefined,
    readingTime: Number(row.reading_time),
    viewCount: Number(row.view_count),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  }
}

export async function createPost(data: {
  title: string
  content: string
  authorId: string
  categoryId: string
  tagIds?: string[]
  status?: Post['status']
  featuredImage?: string
}): Promise<Post> {
  const id = generateId()
  const slug = generateSlug(data.title)
  const excerpt = extractExcerpt(data.content)
  const readingTime = calculateReadingTime(data.content)
  const status = data.status || 'draft'
  const publishedAt = status === 'published' ? new Date().toISOString() : null

  await client.execute({
    sql: `
      INSERT INTO blog_posts (id, title, slug, excerpt, content, featured_image, author_id, category_id, status, published_at, reading_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [id, data.title, slug, excerpt, data.content, data.featuredImage || null, data.authorId, data.categoryId, status, publishedAt, readingTime]
  })

  if (data.tagIds && data.tagIds.length > 0) {
    for (const tagId of data.tagIds) {
      await client.execute({
        sql: 'INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)',
        args: [id, tagId]
      })
    }
  }

  const post = await getPostBySlug(slug)
  return post!
}

export async function updatePost(id: string, data: Partial<{
  title: string
  content: string
  categoryId: string
  tagIds: string[]
  status: Post['status']
  featuredImage: string
}>): Promise<Post | null> {
  const updates: string[] = []
  const args: (string | number | null)[] = []

  if (data.title) {
    updates.push('title = ?', 'slug = ?')
    args.push(data.title, generateSlug(data.title))
  }

  if (data.content) {
    updates.push('content = ?', 'excerpt = ?', 'reading_time = ?')
    args.push(data.content, extractExcerpt(data.content), calculateReadingTime(data.content))
  }

  if (data.categoryId) {
    updates.push('category_id = ?')
    args.push(data.categoryId)
  }

  if (data.status) {
    updates.push('status = ?')
    args.push(data.status)
    if (data.status === 'published') {
      updates.push('published_at = ?')
      args.push(new Date().toISOString())
    }
  }

  if (data.featuredImage !== undefined) {
    updates.push('featured_image = ?')
    args.push(data.featuredImage || null)
  }

  updates.push('updated_at = ?')
  args.push(new Date().toISOString())
  args.push(id)

  await client.execute({
    sql: `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = ?`,
    args
  })

  if (data.tagIds) {
    await client.execute({ sql: 'DELETE FROM blog_post_tags WHERE post_id = ?', args: [id] })
    for (const tagId of data.tagIds) {
      await client.execute({
        sql: 'INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)',
        args: [id, tagId]
      })
    }
  }

  const result = await client.execute({
    sql: 'SELECT slug FROM blog_posts WHERE id = ?',
    args: [id]
  })

  if (result.rows.length === 0) return null
  return getPostBySlug(result.rows[0].slug as string)
}

export async function deletePost(id: string): Promise<boolean> {
  const result = await client.execute({
    sql: 'DELETE FROM blog_posts WHERE id = ?',
    args: [id]
  })
  return result.rowsAffected > 0
}

export async function incrementViewCount(postId: string): Promise<void> {
  await client.execute({
    sql: 'UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?',
    args: [postId]
  })
}

export async function getCategories(): Promise<Category[]> {
  const result = await client.execute(`
    SELECT c.*, COUNT(p.id) as post_count
    FROM blog_categories c
    LEFT JOIN blog_posts p ON c.id = p.category_id AND p.status = 'published'
    GROUP BY c.id
    ORDER BY c.name
  `)

  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string | undefined,
    postCount: Number(row.post_count)
  }))
}

export async function createCategory(name: string, description?: string): Promise<Category> {
  const id = generateId()
  const slug = generateSlug(name)

  await client.execute({
    sql: 'INSERT INTO blog_categories (id, name, slug, description) VALUES (?, ?, ?, ?)',
    args: [id, name, slug, description || null]
  })

  return { id, name, slug, description, postCount: 0 }
}

export async function getTags(): Promise<Tag[]> {
  const result = await client.execute(`
    SELECT t.*, COUNT(pt.post_id) as post_count
    FROM blog_tags t
    LEFT JOIN blog_post_tags pt ON t.id = pt.tag_id
    LEFT JOIN blog_posts p ON pt.post_id = p.id AND p.status = 'published'
    GROUP BY t.id
    ORDER BY t.name
  `)

  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    postCount: Number(row.post_count)
  }))
}

export async function createTag(name: string): Promise<Tag> {
  const id = generateId()
  const slug = generateSlug(name)

  await client.execute({
    sql: 'INSERT INTO blog_tags (id, name, slug) VALUES (?, ?, ?)',
    args: [id, name, slug]
  })

  return { id, name, slug, postCount: 0 }
}

export async function getComments(postId: string): Promise<Comment[]> {
  const result = await client.execute({
    sql: `
      SELECT * FROM blog_comments
      WHERE post_id = ? AND status = 'approved'
      ORDER BY created_at DESC
    `,
    args: [postId]
  })

  const comments = result.rows.map(row => ({
    id: row.id as string,
    postId: row.post_id as string,
    parentId: row.parent_id as string | undefined,
    authorName: row.author_name as string,
    authorEmail: row.author_email as string,
    content: row.content as string,
    status: row.status as Comment['status'],
    createdAt: row.created_at as string
  }))

  const topLevel = comments.filter(c => !c.parentId)
  topLevel.forEach(comment => {
    comment.replies = comments.filter(c => c.parentId === comment.id)
  })

  return topLevel
}

export async function createComment(data: {
  postId: string
  parentId?: string
  authorName: string
  authorEmail: string
  content: string
}): Promise<Comment> {
  const id = generateId()

  await client.execute({
    sql: `
      INSERT INTO blog_comments (id, post_id, parent_id, author_name, author_email, content)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [id, data.postId, data.parentId || null, data.authorName, data.authorEmail, data.content]
  })

  return {
    id,
    postId: data.postId,
    parentId: data.parentId,
    authorName: data.authorName,
    authorEmail: data.authorEmail,
    content: data.content,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
}

export async function getRelatedPosts(postId: string, categoryId: string, limit = 3): Promise<Post[]> {
  const result = await getPosts({
    category: categoryId,
    status: 'published',
    limit: limit + 1
  })

  return result.data.filter(p => p.id !== postId).slice(0, limit)
}
