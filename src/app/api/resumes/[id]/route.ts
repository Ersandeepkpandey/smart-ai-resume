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

    // Parse the content JSON string back to object
    const resume = result.rows[0]
    try {
      if (typeof resume.content === 'string') {
        resume.content = JSON.parse(resume.content)
      }
    } catch (error) {
      console.error('Error parsing resume content:', error)
      // If parsing fails, return the content as is
    }

    return NextResponse.json({ resume })

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
    console.log('PUT request for resume ID:', id)

    const sessionId = await getSessionIdFromCookie()
    console.log('Session ID found:', !!sessionId)

    if (!sessionId) {
      console.log('No session found')
      return NextResponse.json({ error: 'No session found.' }, { status: 401 })
    }

    const user = await verifyUserSession(sessionId)
    console.log('User verified:', !!user, 'User ID:', user?.userId)

    if (!user) {
      console.log('Invalid session')
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })
    }

    const resumeId = id
    const requestBody = await request.json()
    console.log('Request body received:', {
      title: requestBody.title,
      template_id: requestBody.template_id,
      hasContent: !!requestBody.content,
      ats_score: requestBody.ats_score
    })

    const { title, template_id, content, ats_score } = requestBody

    if (!title || !template_id || !content) {
      console.log('Missing required fields:', { title: !!title, template_id: !!template_id, content: !!content })
      return NextResponse.json({ error: 'Title, template_id, and content are required.' }, { status: 400 })
    }

        // Ensure content is properly stringified for database storage
    const contentString = typeof content === 'string' ? content : JSON.stringify(content)

    console.log('Updating resume in database with args:', [title, template_id, !!contentString, ats_score || 0, resumeId, user.userId])

    await client.execute({
      sql: `
        UPDATE resumes
        SET title = ?, template_id = ?, content = ?, ats_score = ?, updated_at = datetime("now")
        WHERE id = ? AND user_id = ?
      `,
      args: [title, template_id, contentString, ats_score || 0, resumeId, user.userId]
    })

    console.log('Database update completed')

    // Get updated resume
    const result = await client.execute({
      sql: 'SELECT id, title, template_id, content, ats_score, created_at, updated_at FROM resumes WHERE id = ? AND user_id = ?',
      args: [resumeId, user.userId]
    })

    console.log('Retrieved updated resume, rows found:', result.rows.length)

    if (result.rows.length === 0) {
      console.log('No resume found after update')
      return NextResponse.json({ error: 'Resume not found or access denied.' }, { status: 404 })
    }

    console.log('Successfully updated resume')

    // Parse the content JSON string back to object
    const resume = result.rows[0]
    try {
      if (typeof resume.content === 'string') {
        resume.content = JSON.parse(resume.content)
      }
    } catch (error) {
      console.error('Error parsing resume content:', error)
      // If parsing fails, return the content as is
    }

    return NextResponse.json({ resume })

  } catch (error: unknown) {
    console.error('Resume update error:', error)
    return NextResponse.json({ error: 'Failed to update resume.' }, { status: 500 })
  }
}