import { NextRequest, NextResponse } from 'next/server'
import { getCategories, createCategory, initBlogTables } from '@/lib/blog'

export async function GET() {
  try {
    await initBlogTables()
    const categories = await getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await initBlogTables()

    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const category = await createCategory(name, description)
    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
