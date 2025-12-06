import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug, updatePost, deletePost, incrementViewCount, initBlogTables } from '@/lib/blog'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await initBlogTables()
    const { slug } = await params

    const post = await getPostBySlug(slug)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    await incrementViewCount(post.id)

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await initBlogTables()
    const { slug } = await params

    const existingPost = await getPostBySlug(slug)
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, content, categoryId, tagIds, status, featuredImage } = body

    const updatedPost = await updatePost(existingPost.id, {
      title,
      content,
      categoryId,
      tagIds,
      status,
      featuredImage
    })

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error('Failed to update post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await initBlogTables()
    const { slug } = await params

    const post = await getPostBySlug(slug)
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const deleted = await deletePost(post.id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Failed to delete post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
