import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/turso'
import { generateSlug } from '@/lib/blog/utils'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const result = await client.execute({
      sql: `SELECT * FROM blog_categories WHERE id = ?`,
      args: [id]
    })

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const row = result.rows[0]
    const category = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      postCount: row.post_count || 0
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Get category error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, slug, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const categorySlug = slug || generateSlug(name)

    const existingResult = await client.execute({
      sql: `SELECT id FROM blog_categories WHERE id = ?`,
      args: [id]
    })

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const slugCheckResult = await client.execute({
      sql: `SELECT id FROM blog_categories WHERE slug = ? AND id != ?`,
      args: [categorySlug, id]
    })

    if (slugCheckResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 409 }
      )
    }

    await client.execute({
      sql: `UPDATE blog_categories
            SET name = ?, slug = ?, description = ?
            WHERE id = ?`,
      args: [name, categorySlug, description || null, id]
    })

    const updatedResult = await client.execute({
      sql: `SELECT * FROM blog_categories WHERE id = ?`,
      args: [id]
    })

    const row = updatedResult.rows[0]
    const category = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      postCount: row.post_count || 0
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const existingResult = await client.execute({
      sql: `SELECT id, post_count FROM blog_categories WHERE id = ?`,
      args: [id]
    })

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const postCount = existingResult.rows[0].post_count as number

    if (postCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts' },
        { status: 400 }
      )
    }

    await client.execute({
      sql: `DELETE FROM blog_categories WHERE id = ?`,
      args: [id]
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
