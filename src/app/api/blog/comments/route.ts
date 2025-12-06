import { NextRequest, NextResponse } from 'next/server'
import { getComments, createComment, initBlogTables } from '@/lib/blog'
import { validateEmail } from '@/lib/blog/utils'

export async function GET(request: NextRequest) {
  try {
    await initBlogTables()

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    const comments = await getComments(postId)
    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await initBlogTables()

    const body = await request.json()
    const { postId, parentId, authorName, authorEmail, content } = body

    if (!postId || !authorName || !authorEmail || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!validateEmail(authorEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (content.length < 3 || content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment must be between 3 and 2000 characters' },
        { status: 400 }
      )
    }

    const comment = await createComment({
      postId,
      parentId,
      authorName: authorName.trim(),
      authorEmail: authorEmail.toLowerCase().trim(),
      content: content.trim()
    })

    return NextResponse.json({
      comment,
      message: 'Comment submitted for moderation'
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
