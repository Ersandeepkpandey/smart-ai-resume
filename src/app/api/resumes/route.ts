import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/turso'
import { getSessionIdFromCookie, getSession } from '@/lib/session'

export async function GET() {
  try {
    const sessionId = await getSessionIdFromCookie()
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }
    const session = await getSession(sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }
    const result = await client.execute({
      sql: 'SELECT id, title, template_id, ats_score, created_at, updated_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC',
      args: [session.user_id]
    })
    return NextResponse.json({ resumes: result.rows })
  } catch (error: unknown) {
    console.error('Resumes fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch resumes.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionIdFromCookie()
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }
    const session = await getSession(sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }
    const { title, template_id, content, ats_score } = await request.json()
    if (!title || !template_id || !content) {
      return NextResponse.json({ error: 'Title, template_id, and content are required.' }, { status: 400 })
    }
    const resumeId = `resume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    await client.execute({
      sql: `
        INSERT INTO resumes (id, user_id, title, template_id, content, ats_score)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [resumeId, session.user_id, title, template_id, content, ats_score || 0]
    })
    // Get the created resume
    const createdResume = await client.execute({
      sql: 'SELECT id, title, template_id, ats_score, created_at, updated_at FROM resumes WHERE id = ?',
      args: [resumeId]
    })
    return NextResponse.json({ resume: createdResume.rows[0] })
  } catch (error: unknown) {
    console.error('Resume creation error:', error)
    return NextResponse.json({ error: 'Failed to create resume.' }, { status: 500 })
  }
}