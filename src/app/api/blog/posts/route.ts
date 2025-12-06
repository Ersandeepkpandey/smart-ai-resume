import { NextRequest, NextResponse } from 'next/server'
import { getPosts, createPost, initBlogTables } from '@/lib/blog'

export async function GET(request: NextRequest) {
  try {
    await initBlogTables()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || undefined
    const tag = searchParams.get('tag') || undefined
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | undefined

    const result = await getPosts({
      page,
      limit,
      category,
      tag,
      search,
      status
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await initBlogTables()

    const body = await request.json()
    const { title, content, authorId, categoryId, tagIds, status, featuredImage } = body

    if (!title || !content || !authorId || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const post = await createPost({
      title,
      content,
      authorId,
      categoryId,
      tagIds,
      status,
      featuredImage
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Failed to create post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
