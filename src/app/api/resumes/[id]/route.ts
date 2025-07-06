import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/turso'
import { getSessionIdFromCookie } from '@/lib/session'
import { verifyUserSession } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const sessionId = await getSessionIdFromCookie()

    if (!sessionId) {
      return NextResponse.json({ error: 'No session found.' }, { status: 401 })
    }

    const user = await verifyUserSession(sessionId)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })
    }

    const resumeId = id

    // First check if the resume belongs to the user
    const checkResult = await client.execute({
      sql: 'SELECT id FROM resumes WHERE id = ? AND user_id = ?',
      args: [resumeId, user.userId]
    })

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Resume not found or access denied.' }, { status: 404 })
    }

    // Delete the resume
    await client.execute({
      sql: 'DELETE FROM resumes WHERE id = ? AND user_id = ?',
      args: [resumeId, user.userId]
    })

    return NextResponse.json({ message: 'Resume deleted successfully' })

  } catch (error: unknown) {
    console.error('Resume deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete resume.' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const sessionId = await getSessionIdFromCookie()

    if (!sessionId) {
      return NextResponse.json({ error: 'No session found.' }, { status: 401 })
    }

    const user = await verifyUserSession(sessionId)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })
    }

    const resumeId = id

    const result = await client.execute({
      sql: 'SELECT id, title, template_id, content, ats_score, created_at, updated_at FROM resumes WHERE id = ? AND user_id = ?',
      args: [resumeId, user.userId]
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Resume not found or access denied.' }, { status: 404 })
    }

    return NextResponse.json({ resume: result.rows[0] })

  } catch (error: unknown) {
    console.error('Resume fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch resume.' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const sessionId = await getSessionIdFromCookie()

    if (!sessionId) {
      return NextResponse.json({ error: 'No session found.' }, { status: 401 })
    }

    const user = await verifyUserSession(sessionId)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })
    }

    const resumeId = id
    const { title, template_id, content, ats_score } = await request.json()

    if (!title || !template_id || !content) {
      return NextResponse.json({ error: 'Title, template_id, and content are required.' }, { status: 400 })
    }

    await client.execute({
      sql: `
        UPDATE resumes
        SET title = ?, template_id = ?, content = ?, ats_score = ?, updated_at = datetime("now")
        WHERE id = ? AND user_id = ?
      `,
      args: [title, template_id, content, ats_score || 0, resumeId, user.userId]
    })

    // Get updated resume
    const result = await client.execute({
      sql: 'SELECT id, title, template_id, content, ats_score, created_at, updated_at FROM resumes WHERE id = ? AND user_id = ?',
      args: [resumeId, user.userId]
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Resume not found or access denied.' }, { status: 404 })
    }

    return NextResponse.json({ resume: result.rows[0] })

  } catch (error: unknown) {
    console.error('Resume update error:', error)
    return NextResponse.json({ error: 'Failed to update resume.' }, { status: 500 })
  }
}