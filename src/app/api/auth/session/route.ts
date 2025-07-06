import { NextRequest, NextResponse } from 'next/server'
import { getSessionIdFromCookie, getSession } from '@/lib/session'
import client from '@/lib/turso'

export async function GET(request: NextRequest) {
  const sessionId = await getSessionIdFromCookie()
  if (!sessionId) {
    return NextResponse.json({ user: null })
  }
  const session = await getSession(sessionId)
  if (!session) {
    return NextResponse.json({ user: null })
  }
  // Get user
  const userResult = await client.execute({
    sql: 'SELECT id, email, full_name, role, status, is_verified FROM users WHERE id = ?',
    args: [session.user_id]
  })
  if (userResult.rows.length === 0) {
    return NextResponse.json({ user: null })
  }
  const user = userResult.rows[0]
  // Get profile
  const profileResult = await client.execute({
    sql: 'SELECT * FROM profiles WHERE id = ?',
    args: [user.id]
  })
  const profile = profileResult.rows[0] || null
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      status: user.status,
      isVerified: user.is_verified,
      profile: profile && {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url,
        role: profile.role,
        status: profile.status,
        lastLogin: profile.last_login,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    }
  })
}