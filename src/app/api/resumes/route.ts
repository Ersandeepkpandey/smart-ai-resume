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
    
    // Ensure resumes table exists
    await client.execute(`
      CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        template_id TEXT NOT NULL,
        content TEXT NOT NULL,
        ats_score INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `)
    
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
    
    const body = await request.json()
    const { title, template_id, content, ats_score } = body
    
    console.log('Resume save request:', { title, template_id, contentType: typeof content, ats_score })
    
    if (!title || !template_id || !content) {
      return NextResponse.json({ 
        error: 'Title, template_id, and content are required.',
        received: { title: !!title, template_id: !!template_id, content: !!content }
      }, { status: 400 })
    }
    
    // Convert content object to JSON string for storage
    const contentString = typeof content === 'string' ? content : JSON.stringify(content)
    
    // Ensure resumes table exists
    await client.execute(`
      CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        template_id TEXT NOT NULL,
        content TEXT NOT NULL,
        ats_score INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `)
    
    const resumeId = `resume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    await client.execute({
      sql: `
        INSERT INTO resumes (id, user_id, title, template_id, content, ats_score)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [resumeId, session.user_id, title, template_id, contentString, ats_score || 0]
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