import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/turso'
import { getSessionIdFromCookie } from '@/lib/session'
import { verifyUserSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const sessionId = await getSessionIdFromCookie()

    if (!sessionId) {
      return NextResponse.json({ error: 'No session found.' }, { status: 401 })
    }

    const user = await verifyUserSession(sessionId)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })
    }

    const result = await client.execute({
      sql: 'SELECT id, email, full_name, role, status, created_at, last_login FROM users WHERE id = ?',
      args: [user.userId]
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    const userData = result.rows[0]

    const profile = {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      role: userData.role,
      status: userData.status,
      created_at: userData.created_at,
      last_login: userData.last_login
    }

    return NextResponse.json({ profile })

  } catch (error: any) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionId = await getSessionIdFromCookie()

    if (!sessionId) {
      return NextResponse.json({ error: 'No session found.' }, { status: 401 })
    }

    const user = await verifyUserSession(sessionId)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })
    }

    const { full_name } = await request.json()

    await client.execute({
      sql: 'UPDATE users SET full_name = ?, updated_at = datetime("now") WHERE id = ?',
      args: [full_name, user.userId]
    })

    // Get updated user
    const result = await client.execute({
      sql: 'SELECT id, email, full_name, role, status, created_at, last_login FROM users WHERE id = ?',
      args: [user.userId]
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    const userData = result.rows[0]

    const profile = {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      role: userData.role,
      status: userData.status,
      created_at: userData.created_at,
      last_login: userData.last_login
    }

    return NextResponse.json({ profile, message: 'Profile updated successfully' })

  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }
}