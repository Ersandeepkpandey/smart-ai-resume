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
      sql: `SELECT * FROM blog_tags WHERE id = ?`,
      args: [id]
    })

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    const row = result.rows[0]
    const tag = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      postCount: row.post_count || 0
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Get tag error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, slug } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const tagSlug = slug || generateSlug(name)

    const existingResult = await client.execute({
      sql: `SELECT id FROM blog_tags WHERE id = ?`,
      args: [id]
    })

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    const slugCheckResult = await client.execute({
      sql: `SELECT id FROM blog_tags WHERE slug = ? AND id != ?`,
      args: [tagSlug, id]
    })

    if (slugCheckResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'A tag with this slug already exists' },
        { status: 409 }
      )
    }

    await client.execute({
      sql: `UPDATE blog_tags SET name = ?, slug = ? WHERE id = ?`,
      args: [name, tagSlug, id]
    })

    const updatedResult = await client.execute({
      sql: `SELECT * FROM blog_tags WHERE id = ?`,
      args: [id]
    })

    const row = updatedResult.rows[0]
    const tag = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      postCount: row.post_count || 0
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Update tag error:', error)
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const existingResult = await client.execute({
      sql: `SELECT id FROM blog_tags WHERE id = ?`,
      args: [id]
    })

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    await client.execute({
      sql: `DELETE FROM blog_post_tags WHERE tag_id = ?`,
      args: [id]
    })

    await client.execute({
      sql: `DELETE FROM blog_tags WHERE id = ?`,
      args: [id]
    })

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Delete tag error:', error)
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    )
  }
}
