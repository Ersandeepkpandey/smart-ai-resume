import { NextRequest, NextResponse } from 'next/server'
import { getTags, createTag, initBlogTables } from '@/lib/blog'

export async function GET() {
  try {
    await initBlogTables()
    const tags = await getTags()
    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await initBlogTables()

    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const tag = await createTag(name)
    return NextResponse.json({ tag }, { status: 201 })
  } catch (error) {
    console.error('Failed to create tag:', error)
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}
